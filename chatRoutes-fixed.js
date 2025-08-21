const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const { query } = require('../config/sqlite-database');
const { authenticate, requirePlan } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Validation middleware
const validateMessage = [
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('personality').optional().isIn(['mentor', 'hacker', 'ceo', 'therapist', 'comedian']),
  body('conversationId').optional().isString()
];

// Send message to AI
router.post('/message', authenticate, validateMessage, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { message, personality = 'mentor', conversationId } = req.body;
    const userId = req.user.id;

    // Check daily limits for free users
    const subscriberResult = await query(
      'SELECT subscription_type FROM subscribers WHERE id = ?',
      [userId]
    );

    const userPlan = subscriberResult.rows[0]?.subscription_type || 'free';
    let count = 0;

    if (userPlan === 'free') {
      // Check daily message count
      const today = new Date().toISOString().split('T')[0];

      const countResult = await query(
        `SELECT COUNT(*) AS message_count FROM messages
         WHERE user_id = ? AND created_at >= ? AND created_at < ?`,
        [userId, `${today}T00:00:00.000Z`, `${today}T23:59:59.999Z`]
      );

      count = parseInt(countResult.rows[0]?.message_count || 0, 10);

      if (count >= 15) {
        return res.status(429).json({
          error: 'Daily message limit reached',
          limit: 15,
          plan: 'free'
        });
      }
    }

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = uuidv4();
      
      await query(
        `INSERT INTO conversations (id, user_id, title) VALUES (?, ?, ?)`,
        [currentConversationId, userId, message.substring(0, 50) + '...']
      );
    }

    // Generate message ID
    const messageId = uuidv4();

    // Save user message
    await query(
      `INSERT INTO messages (id, conversation_id, user_id, content, role) VALUES (?, ?, ?, ?, 'user')`,
      [messageId, currentConversationId, userId, message]
    );

    // Get conversation history for context
    const messagesResult = await query(
      `SELECT content, role FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC
       LIMIT 20`,
      [currentConversationId]
    );

    // Build conversation context
    const conversationMessages = messagesResult.rows.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Personality-based system prompts
    const personalityPrompts = {
      mentor: "You are a wise and supportive AI mentor. Provide thoughtful, educational guidance with encouraging undertones. Use 🧠 emoji occasionally.",
      hacker: "You are a technical AI assistant with cybersecurity expertise. Be precise, analytical, and focus on ethical security practices. Use ⚡ emoji occasionally.",
      ceo: "You are a strategic business AI advisor. Think like a CEO - focus on ROI, scalability, and actionable business insights. Use 💼 emoji occasionally.",
      therapist: "You are an empathetic AI life coach. Be supportive, understanding, and help users work through challenges positively. Use 💫 emoji occasionally.",
      comedian: "You are a witty AI assistant who adds humor while being genuinely helpful. Keep things light but informative. Use 😄 emoji occasionally."
    };

    const systemPrompt = personalityPrompts[personality] || personalityPrompts.mentor;

    // Generate AI response
    let aiResponse;
    if (!openai || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
      aiResponse = `Hello! I'm your ${personality} AI assistant. I'm currently running in demo mode since no OpenAI API key is configured. However, I can still help you navigate the platform and understand its features! How can I assist you today? 🤖`;
    } else {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationMessages
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        aiResponse = completion.choices[0].message.content;
      } catch (error) {
        console.error('OpenAI API error:', error);
        aiResponse = `I apologize, but I'm having trouble connecting to the AI service right now. This might be due to API limits or configuration issues. Please try again in a moment, or contact support if the issue persists.`;
      }
    }

    // Save AI response
    const assistantMessageId = uuidv4();
    await query(
      `INSERT INTO messages (id, conversation_id, user_id, content, role) VALUES (?, ?, ?, ?, 'assistant')`,
      [assistantMessageId, currentConversationId, userId, aiResponse]
    );

    res.json({
      response: aiResponse,
      conversationId: currentConversationId,
      personality,
      messagesLeft: userPlan === 'free' ? 15 - count - 1 : null
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
});

// Get conversation history
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const conversationsResult = await query(
      `SELECT id, title, created_at, updated_at FROM conversations 
       WHERE user_id = ? 
       ORDER BY updated_at DESC 
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), offset]
    );

    const conversations = conversationsResult.rows;

    res.json({
      conversations: conversations || [],
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        hasMore: conversations.length === parseInt(limit, 10)
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversations' 
    });
  }
});

// Get specific conversation
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const conversationResult = await query(
      `SELECT id, title, created_at, updated_at FROM conversations 
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messagesResult = await query(
      `SELECT id, content, role, created_at FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC`,
      [id]
    );

    const conversation = conversationResult.rows[0];
    conversation.messages = messagesResult.rows || [];

    res.json(conversation);

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversation' 
    });
  }
});

// Delete conversation
router.delete('/conversations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM conversations WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to delete conversation' 
    });
  }
});

// Get user stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Get total conversations
    const conversationsResult = await query(
      'SELECT COUNT(*) AS total_conversations FROM conversations WHERE user_id = ?',
      [req.user.id]
    );

    // Get total messages
    const messagesResult = await query(
      'SELECT COUNT(*) AS total_messages FROM messages WHERE user_id = ?',
      [req.user.id]
    );

    // Get today's messages
    const today = new Date().toISOString().split('T')[0];
    const todayMessagesResult = await query(
      `SELECT COUNT(*) AS today_messages FROM messages 
       WHERE user_id = ? AND created_at >= ? AND created_at < ?`,
      [req.user.id, `${today}T00:00:00.000Z`, `${today}T23:59:59.999Z`]
    );

    res.json({
      totalConversations: parseInt(conversationsResult.rows[0]?.total_conversations || 0, 10),
      totalMessages: parseInt(messagesResult.rows[0]?.total_messages || 0, 10),
      todayMessages: parseInt(todayMessagesResult.rows[0]?.today_messages || 0, 10)
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats' 
    });
  }
});

module.exports = router;

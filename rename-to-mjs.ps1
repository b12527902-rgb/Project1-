$files = Get-ChildItem -Path "D:\Chatty-Web-main\backend\src" -Recurse -Filter "*.js"
foreach ($file in $files) {
    $newName = $file.Name -replace '\.js$', '.mjs'
    Rename-Item -Path $file.FullName -NewName $newName
    Write-Host "Renamed $($file.Name) to $newName"
}

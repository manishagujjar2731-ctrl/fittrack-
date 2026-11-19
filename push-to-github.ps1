# FitTrack Pro - Push to manishagujjar2731-ctrl/fittrack-
$gitPath = "$env:LOCALAPPDATA\Programs\Git\cmd"
$ghPath = "$env:LOCALAPPDATA\Programs\gh"
$env:Path = "$gitPath;$ghPath;$env:Path"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Uploading to GitHub: fittrack-                  " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

git remote set-url origin https://github.com/manishagujjar2731-ctrl/fittrack-.git
git branch -M main

Write-Host "`nPushing files to https://github.com/manishagujjar2731-ctrl/fittrack- ..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=================================================" -ForegroundColor Green
    Write-Host " SUCCESS! Your website is live on GitHub!        " -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Green
    Start-Process "https://github.com/manishagujjar2731-ctrl/fittrack-"
} else {
    Write-Host "`nIf prompted above, please complete the browser sign-in to authorize Git." -ForegroundColor Yellow
}

Write-Host "`nPress any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

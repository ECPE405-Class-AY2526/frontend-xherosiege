# PowerShell Production Build Script
Write-Host "🚀 Building for Production..." -ForegroundColor Green

# Build client
Write-Host "📦 Building React client..." -ForegroundColor Yellow
Set-Location client
npm install
npm run build

if (Test-Path "dist") {
    Write-Host "✅ Client build successful - dist folder created" -ForegroundColor Green
} else {
    Write-Host "❌ Client build failed - no dist folder found" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Install server dependencies  
Write-Host "🔧 Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install

Write-Host "✅ Production build complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set production environment variables in server/.env.production" -ForegroundColor White
Write-Host "2. Update MONGO_URI with your production database" -ForegroundColor White  
Write-Host "3. Update CLIENT_URL with your production domain" -ForegroundColor White
Write-Host "4. Run: cd server && npm start" -ForegroundColor White
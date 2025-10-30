@echo off
echo 🚀 Building for Production...

echo 📦 Building React client...
cd client
call npm install
call npm run build

if exist "dist" (
    echo ✅ Client build successful - dist folder created
) else (
    echo ❌ Client build failed - no dist folder found
    pause
    exit /b 1
)

cd ..

echo 🔧 Installing server dependencies...
cd server
call npm install

echo ✅ Production build complete!
echo 📋 Next steps:
echo 1. Set production environment variables in server/.env.production
echo 2. Update MONGO_URI with your production database
echo 3. Update CLIENT_URL with your production domain
echo 4. Run: cd server && npm start
pause
# Script PowerShell pour créer le fichier .env
# Usage: .\create-env.ps1

$envContent = @"
# Application Configuration
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/dam_backend

# JWT Configuration (REQUIRED - minimum 20 characters)
# ⚠️ Change this to a secure random string in production!
JWT_SECRET=default_jwt_secret_key_1234567890

# Frontend URL (optional, for OAuth redirects)
FRONTEND_URL=http://localhost:3000

# Google OAuth2 Configuration
# Get these from: https://console.cloud.google.com/apis/credentials
# See ENV_SETUP.md for detailed instructions
GOOGLE_CLIENT_ID=ton_client_id_google
GOOGLE_CLIENT_SECRET=ton_secret_google
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/redirect

# Facebook OAuth2 Configuration (optional)
# Get these from: https://developers.facebook.com/apps
# See ENV_SETUP.md for detailed instructions
FACEBOOK_APP_ID=ton_app_id_facebook
FACEBOOK_APP_SECRET=ton_app_secret_facebook
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/v1/auth/facebook/redirect
"@

if (Test-Path .env) {
    Write-Host "Le fichier .env existe deja!" -ForegroundColor Yellow
    $overwrite = Read-Host "Voulez-vous l'ecraser? (o/N)"
    if ($overwrite -ne "o" -and $overwrite -ne "O") {
        Write-Host "Operation annulee." -ForegroundColor Red
        exit
    }
}

$envContent | Out-File -FilePath .env -Encoding utf8
Write-Host "Fichier .env cree avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez le fichier .env" -ForegroundColor White
Write-Host "   2. Remplacez les valeurs placeholder par vos vraies credentials" -ForegroundColor White
Write-Host "   3. Consultez ENV_SETUP.md pour obtenir les credentials OAuth" -ForegroundColor White
Write-Host ""


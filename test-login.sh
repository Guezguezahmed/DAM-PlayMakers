#!/bin/bash

# Script de test pour le login
# Usage: ./test-login.sh

# Configuration (modifiez selon votre environnement)
BACKEND_URL="${BACKEND_URL:-https://votre-backend.onrender.com}"
EMAIL="${TEST_EMAIL:-user@example.com}"
PASSWORD="${TEST_PASSWORD:-votre_mot_de_passe}"

echo "🧪 Test de Login"
echo "================="
echo "URL: $BACKEND_URL/api/v1/auth/login"
echo "Email: $EMAIL"
echo ""

# Faire la requête
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

# Séparer le body et le status code
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "📊 Status Code: $http_code"
echo ""

# Afficher la réponse
if [ "$http_code" -eq 200 ]; then
  echo "✅ Login réussi!"
  echo "$body" | jq '.'
  
  # Extraire le token
  token=$(echo "$body" | jq -r '.access_token')
  if [ "$token" != "null" ] && [ -n "$token" ]; then
    echo ""
    echo "🔑 Token: ${token:0:50}..."
  fi
else
  echo "❌ Login échoué"
  echo "$body" | jq '.'
fi


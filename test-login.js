/**
 * Script de test pour le login
 * Usage: node test-login.js
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  // Changez ces valeurs selon votre environnement
  hostname: process.env.BACKEND_HOST || 'votre-backend.onrender.com',
  port: process.env.BACKEND_PORT || 443,
  path: '/api/v1/auth/login',
  useHttps: process.env.BACKEND_PORT !== '3002', // HTTP si port 3002 (local)
  email: process.env.TEST_EMAIL || 'user@example.com',
  password: process.env.TEST_PASSWORD || 'votre_mot_de_passe',
};

// Données de login
const data = JSON.stringify({
  email: config.email,
  password: config.password,
});

// Options de la requête
const options = {
  hostname: config.hostname,
  port: config.port,
  path: config.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

console.log('🧪 Test de Login');
console.log('================');
console.log(`URL: ${config.useHttps ? 'https' : 'http'}://${config.hostname}:${config.port}${config.path}`);
console.log(`Email: ${config.email}`);
console.log('');

// Fonction pour faire la requête
function makeRequest() {
  const client = config.useHttps ? https : http;

  const req = client.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    console.log('');

    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(responseData);
        console.log('✅ Réponse:');
        console.log(JSON.stringify(jsonData, null, 2));
        console.log('');

        if (res.statusCode === 200 && jsonData.access_token) {
          console.log('🎉 Login réussi!');
          console.log(`🔑 Token: ${jsonData.access_token.substring(0, 50)}...`);
        } else {
          console.log('❌ Login échoué');
          console.log(`Message: ${jsonData.message || 'Erreur inconnue'}`);
        }
      } catch (error) {
        console.error('❌ Erreur lors du parsing de la réponse:', error);
        console.log('Réponse brute:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête:', error.message);
    console.error('');
    console.error('💡 Vérifiez que:');
    console.error('   - Le backend est accessible');
    console.error('   - L\'URL est correcte');
    console.error('   - Les variables d\'environnement sont définies');
  });

  req.write(data);
  req.end();
}

// Exécuter le test
makeRequest();


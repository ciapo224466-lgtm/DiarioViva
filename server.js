const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const CV_BASE = 'https://www.cviva.it/api/v1';

app.post('/api/login', async (req, res) => {
  // Gestisce sia il nuovo che il vecchio formato di parametri
  const username = req.body.username || req.body.ident;
  const password = req.body.password || req.body.pass || req.body.pwd;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password obbligatori' });
  }

  try {
    const response = await fetch(`${CV_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ ident: username, pass: password })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || data.error || 'Credenziali non valide o errore ClasseViva' 
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Errore di connessione a ClasseViva' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy attivo sulla porta ${PORT}`));

const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

const CV_BASE = 'https://www.cviva.it/api/v1';

// Endpoint per la Login
app.post('/api/login', async (req, res) => {
  // Gestisce sia username/password che ident/pass/pwd per massima compatibilità
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

// Endpoint per scaricare l'Agenda
app.get('/api/agenda/:custCode/:begin/:end', async (req, res) => {
  const { custCode, begin, end } = req.params;
  const token = req.headers['z-auth-token'];

  if (!token) {
    return res.status(401).json({ error: 'Token di autenticazione mancante' });
  }

  try {
    const response = await fetch(`${CV_BASE}/students/${custCode}/agenda/all/${begin}/${end}`, {
      headers: { 
        'Z-Auth-Token': token,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dell\'agenda' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy attivo sulla porta ${PORT}`));

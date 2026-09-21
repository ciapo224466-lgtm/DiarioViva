const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Se usi Node 18+ puoi usare anche il fetch nativo

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint di test per il tasto "Test Server Render"
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Server Render attivo e pronto' });
});

// Endpoint di Login verso ClasseViva
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Controllo validità input per evitare Bad Request dal client
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Parametri mancanti: inserire username e password' 
    });
  }

  try {
    // Chiamata diretta all'API ufficiale di ClasseViva (Spaggiari)
    const cvResponse = await fetch('https://web.spaggiari.eu/rest/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CVApp/21.1.0',
        'Z-Dev-Apikey': '+A9342232155444' // Key di sistema per le API Spaggiari
      },
      body: JSON.stringify({
        ident: null,
        pass: password,
        uid: username
      })
    });

    const data = await cvResponse.json();

    if (!cvResponse.ok) {
      return res.status(cvResponse.status).json({
        error: 'Errore durante l autenticazione su ClasseViva',
        details: data
      });
    }

    // Risposta di successo inoltrata al frontend
    return res.json(data);

  } catch (error) {
    console.error('Errore Proxy Render:', error);
    return res.status(500).json({ 
      error: 'Errore interno del server Render', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

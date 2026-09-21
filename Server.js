const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // O gestore fetch nativo su Node 18+

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint di test per verificare che Render sia attivo
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Server Render attivo' });
});

// Endpoint di Login proxy verso ClasseViva
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password obbligatori' });
  }

  try {
    const cvResponse = await fetch('https://web.spaggiari.eu/rest/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CVApp/21.1.0'
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
        error: 'Autenticazione ClasseViva fallita',
        details: data
      });
    }

    // Restituisce i token e le info restituite da Spaggiari
    return res.json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Errore interno del proxy', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Render attivo sulla porta ${PORT}`);
});

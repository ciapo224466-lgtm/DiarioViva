const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  try {
    const response = await fetch('https://web.spaggiari.eu/rest/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CVReq/20201110',
        'Z-Dev-Apikey': '+4865672a9390b0271'
      },
      body: JSON.stringify({
        ident: req.body.ident,
        pwd: req.body.pwd
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la connessione a ClasseViva' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));

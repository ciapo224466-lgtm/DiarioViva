// Inserisci qui l'URL esatto del tuo servizio Render
const RENDER_SERVER_URL = 'https://diarioviva.onrender.com'; // Sostituisci con il tuo URL Render

function logCV(msg) {
  const box = document.getElementById('cvLog');
  box.innerHTML += '<br>> ' + msg;
  box.scrollTop = box.scrollHeight;
}

// Funzione per svegliare/testare il server Render
async function testRenderServer() {
  logCV('Controllo stato server Render...');
  try {
    const res = await fetch(`${RENDER_SERVER_URL}/ping`);
    if (res.ok) {
      logCV('Server Render online e pronto!');
    } else {
      logCV('Server Render ha risposto con codice: ' + res.status);
    }
  } catch (err) {
    logCV('ERRORE: Impossibile raggiungere il server Render. Potrebbe essere in pausa (spinta in corso...).');
  }
}

// Funzione di sincronizzazione con gestione errore 400
async function syncClasseViva() {
  const user = document.getElementById('cvUser').value.trim();
  const pass = document.getElementById('cvPass').value.trim();

  if (!user || !pass) {
    logCV('ERRORE: Inserisci username e password.');
    return;
  }

  logCV('Controllo stato server Render...');
  logCV('Invio credenziali a ClasseViva via Render...');

  try {
    const response = await fetch(`${RENDER_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        logCV('ERRORE SYNC: Risposta HTTP 400 (Credenziali incomplete o formato non valido)');
      } else if (response.status === 422 || response.status === 401) {
        logCV('ERRORE SYNC: Codice Utente o Password errati.');
      } else {
        logCV('ERRORE SYNC: Risposta HTTP ' + response.status);
      }
      return;
    }

    logCV('Connessione riuscita! Token ottenuto: ' + (result.token || 'OK'));
    
    // Aggiorna interfaccia
    const statusEl = document.getElementById('cvStatus');
    if (statusEl) {
      statusEl.className = 'cv-status connected';
      statusEl.textContent = '● Collegato (' + user + ')';
    }

  } catch (err) {
    logCV('ERRORE DI RETE: ' + err.message);
    logCV('Suggerimento: Premi "Test Server Render" per svegliare il server Render se era in pausa.');
  }
}

// Event Listeners
document.getElementById('cvConnectBtn').addEventListener('click', syncClasseViva);
document.getElementById('testRenderBtn').addEventListener('click', testRenderServer);

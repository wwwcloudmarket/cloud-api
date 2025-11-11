// Простой мок эндпоинта /api/raffles: GET список, POST заявка
// Работает без Express. Тело POST парсим вручную.

function readJsonBody(req) {
  return new Promise((resolve) => {
    if (req.method === 'GET' || req.method === 'HEAD') return resolve({});
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { resolve({}); }
    });
  });
}

// Память в рамках "теплого" инстанса (для демо)
const store = globalThis.__RAFFLES__ || { items: [
  { id: 'demo-1', title: 'Drop: Hoodie Black', winners_count: 10, starts_at: new Date().toISOString() }
]};
globalThis.__RAFFLES__ = store;

module.exports = async (req, res) => {
  // CORS на всякий случай (если дергать с другого домена)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ raffles: store.items });
  }

  if (req.method === 'POST') {
    const body = await readJsonBody(req);
    const { name, telegram, size } = body || {};

    if (!name || !telegram || !size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // В реальном проекте — сохраняем в БД
    store.items = store.items || [];
    store.items.push({
      id: `req-${Date.now()}`,
      title: `Заявка: ${name} (${size})`,
      winners_count: 1,
      created_at: new Date().toISOString(),
      meta: { telegram }
    });

    return res.status(201).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method Not Allowed' });
};

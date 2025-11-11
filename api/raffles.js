module.exports = async (req, res) => {
  // Разрешим CORS, если будешь дергать с другого домена (например, Tilda)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ raffles: [] });
  }

  if (req.method === 'POST') {
    const data = req.body || {};
    return res.status(201).json({ created: true, data });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method Not Allowed' });
};

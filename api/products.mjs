import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!url || !key) {
    return res.status(500).json({
      products: [],
      error: 'Missing Supabase env',
      hint: 'Добавь SUPABASE_URL и SUPABASE_ANON_KEY в Vercel → Project → Settings → Environment Variables.'
    });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const limit = Math.max(1, Math.min(60, Number(req.query.limit) || 12));
  const offset = Math.max(0, Number(req.query.offset) || 0);

  // 1-я попытка: с сортировкой по created_at (если столбец есть)
  let { data, error } = await supabase
    .from('products')
    .select('id,title,price,image_url,description,is_available,created_at')
    .eq('is_available', true)          // твой флаг
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Фолбэк: если нет created_at — запрос без сортировки
  if (error && /created_at/i.test(error.message || '')) {
    const r2 = await supabase
      .from('products')
      .select('id,title,price,image_url,description,is_available')
      .eq('is_available', true)
      .range(offset, offset + limit - 1);
    data = r2.data; error = r2.error;
  }

  if (error) {
    return res.status(200).json({ products: [], error: error.message });
  }

  return res.status(200).json({ products: data || [] });
}

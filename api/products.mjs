// /api/products — Supabase + самодиагностика
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!url || !key) {
    return res.status(500).json({
      products: [],
      error: 'Missing Supabase env',
      hint: 'Добавь SUPABASE_URL и SUPABASE_ANON_KEY в Vercel → Project → Settings → Environment Variables (и для Production, и для Preview), потом Redeploy.'
    });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const limit = Math.max(1, Math.min(60, Number(req.query.limit) || 12));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const debug = String(req.query.debug || '') === '1';

  // 1-я попытка: ожидаемые столбцы
  let data = null, error = null;
  let r1 = await supabase
    .from('products')
    .select('id,title,price,image_url,is_active,created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (r1.error) {
    // Если нет каких-то столбцов — делаем безопасный фолбэк на *
    const colMissing = /column .* does not exist|42703|unknown column/i.test(r1.error.message || '');
    if (colMissing) {
      const r2 = await supabase
        .from('products')
        .select('*')
        .range(offset, offset + limit - 1);
      data = r2.data; error = r2.error;
    } else {
      error = r1.error;
    }
  } else {
    data = r1.data;
  }

  if (error) {
    const rls = /row-level security|permission denied|not authorized/i.test(error.message || '');
    const missingTable = /relation .*products.* does not exist|not found/i.test(error.message || '');
    return res.status(200).json({
      products: [],
      error: error.message,
      ...(rls ? { rls_blocked: true, hint: 'Включи RLS и сделай политику SELECT для anon на таблицу products.' } : {}),
      ...(missingTable ? { missing_table: true, hint: 'Создай public.products (см. SQL ниже).' } : {}),
      debug: debug ? { limit, offset } : undefined
    });
  }

  // Нормальный ответ
  return res.status(200).json({
    products: data || [],
    debug: debug ? { limit, offset, rows: (data || []).length } : undefined
  });
}

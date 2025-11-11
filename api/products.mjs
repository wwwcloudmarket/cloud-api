// /api/products — тянем список товаров из Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Пагинация по желанию: ?limit=12&offset=0
  const limit = Math.max(1, Math.min(60, Number(req.query.limit) || 12));
  const offset = Math.max(0, Number(req.query.offset) || 0);

  // Пробуем прочитать таблицу products
  const { data, error } = await supabase
    .from('products')
    .select('id,title,price,image_url,is_active,created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Если таблицы нет — вернём подсказку
  if (error) {
    const missing =
      /does not exist|not found|relation.*products/i.test(error.message || '') ||
      error.code === 'PGRST116';

    return res.status(200).json({
      products: [],
      missing_table: missing || undefined,
      hint: missing
        ? 'Создай таблицу public.products и включи политику SELECT для anon'
        : 'Ошибка запроса к Supabase',
      error: error.message
    });
  }

  return res.status(200).json({ products: data || [] });
}

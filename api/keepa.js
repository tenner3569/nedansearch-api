// ASINとJANのキャッシュ（メモリ内、Vercelの再起動でリセット）
const cache = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tenner3569.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { asin } = req.query;
  if (!asin) return res.status(400).json({ error: 'asin is required' });

  const upperAsin = asin.toUpperCase();

  // キャッシュに存在する場合はそのまま返す
  if (cache.has(upperAsin)) {
    return res.status(200).json({ jan: cache.get(upperAsin), cached: true });
  }

  const API_KEY = process.env.KEEPA_API_KEY;

  try {
    const keepaRes = await fetch(
      `https://api.keepa.com/product?key=${API_KEY}&domain=5&asin=${upperAsin}&stats=0&offers=0`
    );
    const keepaData = await keepaRes.json();

    if (!keepaData.products || keepaData.products.length === 0) {
      return res.status(200).json({ jan: null });
    }

    const product = keepaData.products[0];
    const jan = product.eanList?.[0] || null;

    // キャッシュに保存（最大1000件まで）
    if (cache.size >= 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    if (jan) cache.set(upperAsin, jan);

    res.status(200).json({ jan, title: product.title });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

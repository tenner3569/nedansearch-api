export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tenner3569.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { asin } = req.query;
  if (!asin) return res.status(400).json({ error: 'asin is required' });

  const API_KEY = process.env.KEEPA_API_KEY;

  try {
    const keepaRes = await fetch(
      `https://api.keepa.com/product?key=${API_KEY}&domain=5&asin=${asin}&stats=0&offers=0`
    );
    const keepaData = await keepaRes.json();

    // デバッグ用：生データをそのまま返す
    res.status(200).json({ debug: keepaData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

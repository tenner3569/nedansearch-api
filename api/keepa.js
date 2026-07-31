export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tenner3569.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { asin } = req.query;
  if (!asin) return res.status(400).json({ error: 'asin is required' });

  const API_KEY = process.env.KEEPA_API_KEY;

  try {
    const keepaRes = await fetch(
      `https://api.keepa.com/product?key=${API_KEY}&domain=5&asin=${asin}`
    );
    const keepaData = await keepaRes.json();

    res.status(200).json({ 
      productsLength: keepaData.products?.length,
      tokensLeft: keepaData.tokensLeft,
      refillRate: keepaData.refillRate,
      firstProduct: keepaData.products?.[0] ? {
        asin: keepaData.products[0].asin,
        eanList: keepaData.products[0].eanList,
        title: keepaData.products[0].title
      } : null
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

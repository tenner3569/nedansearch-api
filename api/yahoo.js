export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tenner3569.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword is required' });

  const APP_ID = process.env.YAHOO_APP_ID;
  const SID    = process.env.YAHOO_SID;
  const PID    = process.env.YAHOO_PID;

  try {
    const yahooRes = await fetch(
      `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${APP_ID}&affiliate_type=vc&sid=${SID}&pid=${PID}&query=${encodeURIComponent(keyword)}&results=30&sort=%2Bprice`
    );
    const yahooData = await yahooRes.json();

    const items = yahooData.hits.map(i => ({
      platform: 'yahoo',
      shopName: i.seller?.name || 'Yahoo!ショッピング',
      title:    i.name,
      price:    i.price,
      url:      i.affiliateUrl || i.url,
      image:    i.image?.medium || ''
    }));

    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

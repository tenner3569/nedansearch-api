export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tenner3569.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword is required' });

  const APP_ID    = process.env.RAKUTEN_APP_ID;
  const AFFILIATE = process.env.RAKUTEN_AFFILIATE_ID;

  try {
    const rakutenRes = await fetch(
      `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?applicationId=${APP_ID}&affiliateId=${AFFILIATE}&keyword=${encodeURIComponent(keyword)}&hits=30&sort=%2BitemPrice`
    );
    const rakutenData = await rakutenRes.json();

    if (!rakutenData.Items || rakutenData.Items.length === 0) {
      return res.status(200).json({ items: [] });
    }

    const items = rakutenData.Items.map(({ Item: i }) => ({
      platform: 'rakuten',
      shopName: i.shopName,
      title:    i.itemName,
      price:    i.itemPrice,
      url:      i.affiliateUrl || i.itemUrl,
      image:    i.mediumImageUrls?.[0]?.imageUrl || ''
    }));

    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

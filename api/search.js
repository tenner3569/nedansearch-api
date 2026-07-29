export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tenner3569.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword is required' });

  const APP_ID    = process.env.RAKUTEN_APP_ID;
  const AFFILIATE = process.env.RAKUTEN_AFFILIATE_ID;

  try {
    const rakutenRes = await fetch(
      `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?applicationId=${APP_ID}&affiliateId=${AFFILIATE}&keyword=${encodeURIComponent(keyword)}&hits=30&sort=%2BitemPrice&formatVersion=2`
    );
    const rakutenData = await rakutenRes.json();

    // デバッグ用：生データをそのまま返す
    res.status(200).json({ debug: rakutenData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// api/send.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing text' });
    }

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ ok: false, error: 'Missing Telegram env vars' });
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };

    const tgResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await tgResponse.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data });
    }

    // PHP tarafına sade bir cevap dönüyoruz
    return res.status(200).json({
      ok: true,
      message_id: data.result?.message_id ?? null
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

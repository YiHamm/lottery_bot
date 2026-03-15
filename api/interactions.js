import { verifyKey } from 'discord-interactions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  const rawBody =
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  if (!isValidRequest) {
    return res.status(401).send('Bad request signature');
  }

  const interaction = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // Discord 驗證 endpoint 時會先送 PING
  if (interaction.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  return res.status(200).json({
    type: 4,
    data: {
      content: '機器人 endpoint 已成功收到互動事件。'
    }
  });
}
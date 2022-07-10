import type { NextApiHandler } from 'next';
import screenshot from './screenshot';

const handler: NextApiHandler = async (req, res) => {
  req.headers.Authorization = process.env.GLIMPSE_PASSPHASE;

  await screenshot(req, res);
};

export default handler;

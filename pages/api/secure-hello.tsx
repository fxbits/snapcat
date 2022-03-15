import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function secureHello(req, res) {
  const session  = getSession(req, res);
  res.json({ protected: 'My Secret', nickname: session?.user.nickname });
});
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// ─── POST /api/auth/login ─────────────────────────────────
// Mock auth — replace with Google OAuth / NextAuth in production
router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // TODO: Validate with Google OAuth and look up user in DB
  const mockUser = { id: 'user_mock_001', email };
  const token = jwt.sign(mockUser, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

  res.json({ token, user: mockUser });
});

// ─── POST /api/auth/google ────────────────────────────────
router.post('/google', (req: Request, res: Response) => {
  // TODO: Verify Google ID token, upsert user in DB, return JWT
  res.json({ message: 'Google OAuth integration coming soon' });
});

// ─── GET /api/auth/me ─────────────────────────────────────
router.get('/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

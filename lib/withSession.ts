import { withIronSession, SessionOptions } from 'next-iron-session'; 
import { NextApiRequest, NextApiResponse } from 'next';

// Define the type of the session data you want to store
interface SessionData {
  phone: string;
  role: string;
  token: string;
}

// Configure the session options with a secret password and cookie settings
const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'your-secret-password', // Must be at least 32 characters
  cookieName: 'user_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
  },
};

// The withSession function wraps API handlers to add session capabilities
export function withSession(handler: (req: NextApiRequest, res: NextApiResponse) => void) {
  return withIronSession(handler, sessionOptions);
}

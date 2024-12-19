// next.d.ts
import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    session?: { [key: string]: any }; // Adjust the session type as needed
  }
}

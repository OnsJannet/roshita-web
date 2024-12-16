import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageName } = req.query as { imageName: string };
  const imagePath = path.join(process.cwd(), 'uploads', imageName);

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    // Serve the image
    const imageStream = fs.createReadStream(imagePath);
    res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type
    imageStream.pipe(res);
  } else {
    // Return a 404 error if the image doesn't exist
    res.status(404).end();
  }
}
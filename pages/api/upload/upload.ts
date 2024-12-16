import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import busboy from 'busboy'; // Ensure you've installed the 'busboy' package

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};

const handleUpload = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("entered");

  const imageDir = path.join(process.cwd(), 'public/uploading');

  // Make sure the uploads folder exists
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const bb = busboy({ headers: req.headers });

  // Handle file uploads
  bb.on('file', (
    fieldname: string,
    file: fs.ReadStream,
    fileInfo: { filename: string, encoding: string, mimeType: string }, // Destructure the object
  ) => {
    const filename = fileInfo.filename; // Extract filename as string
  
    console.log('Filename:', filename);
  
    if (typeof filename !== 'string') {
      console.error('Invalid filename:', filename);
      return res.status(400).json({ success: false, message: 'Invalid filename' });
    }
  
    // Define file path
    const filePath = path.join(imageDir, filename);
  
    // Debugging file path
    console.log('File path:', filePath);
  
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);
  
    writeStream.on('finish', () => {
      res.status(200).json({ success: true, path: `/uploading/${filename}` });
    });
  });
  

  bb.on('error', (error: any) => {
    console.error(error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  });

  req.pipe(bb);
};

export default handleUpload;

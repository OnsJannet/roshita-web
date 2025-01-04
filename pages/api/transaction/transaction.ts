import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URLS = {
  sadad: 'https://api.plutus.ly/api/v1/transaction/sadadapi',
  tlync: 'https://api.plutus.ly/api/v1/transaction/tlync',
  edfali: 'https://api.plutus.ly/api/v1/transaction/edfali',
  localbankcards: 'https://api.plutus.ly/api/v1/transaction/localbankcards',
  mpgs: 'https://api.plutus.ly/api/v1/transaction/mpgs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { service } = req.query;

  try {
    if (method === 'POST') {
      const { action, payload } = req.body;

      if (!service || !action || !payload) {
        return res.status(400).json({ error: 'Service, action, and payload are required' });
      }

      const baseUrl = BASE_URLS[service as keyof typeof BASE_URLS];
      if (!baseUrl) {
        return res.status(400).json({ error: 'Invalid service' });
      }

      let endpoint = '';
      if (action === 'verify') {
        endpoint = `${baseUrl}/verify`;
      } else if (action === 'confirm') {
        endpoint = `${baseUrl}/confirm`;
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }

      const apiResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        return res.status(apiResponse.status).json({ error: data.message || 'API request failed' });
      }

      return res.status(200).json(data);
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

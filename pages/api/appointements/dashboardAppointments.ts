import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { page = 1 } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Forward the request to your external API with the token from frontend
    const response = await fetch(
      `http://www.test-roshita.net/api/appointment-reservations/search/?page=${page}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const data = await response.json();

    // Filter and sort on the backend
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredAppointments = data.results
      .filter((appointment: any) => {
        const status = appointment.reservation.reservation_payment_status;
        return status !== 'Cancelled' && status !== 'Completed';
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.reservation.reservation_date);
        const dateB = new Date(b.reservation.reservation_date);
        return dateA.getTime() - dateB.getTime();
      });

    return res.status(200).json({
      appointments: filteredAppointments,
      totalPages: Math.ceil(filteredAppointments.length / 5),
      hasNext: data.next !== null,
    });
  } catch (error) {
    console.error('Error in dashboardAppointments API:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
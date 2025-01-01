import type { NextApiRequest, NextApiResponse } from "next";

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  hospital: string;
  city: string;
  address: string | null;
  image: string;
  price: string;
  rating: number | null;
  appointment_dates: string[];
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Doctor[];
  total?: number;
  details?: any;
}

export default async function getDoctors(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Extract the CSRF token from the environment
    const csrfToken = process.env.CSRF_TOKEN;

    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    //const response = await fetch("https://test-roshita.net/api/doctors-list/", {
      const response = await fetch("https://test-roshita.net/api/user-doctors", {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    const data = await response.json();
    console.log("Doctors list:", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    // Extract the doctors array from the response
    const doctors = data.results?.data?.doctors || [];

    return res.status(200).json({
      success: true,
      data: doctors,
      total: doctors.length,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

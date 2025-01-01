import type { NextApiRequest, NextApiResponse } from "next";

interface Hospital {
  id: number;
  name: string;
  doctors: any[]; // Update with a more specific type if needed
  specialities: any[]; // Update with a more specific type if needed
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Hospital[];
  total?: number;
  details?: any;
}

export default async function getHospitals(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const response = await fetch("https://test-roshita.net/api/user-hospitals-list/", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("Hospitals list:", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    // Extract the hospitals array from the response
    const hospitals = data.hospitals || [];

    return res.status(200).json({
      success: true,
      data: hospitals,
      total: hospitals.length,
    });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

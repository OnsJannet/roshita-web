import type { NextApiRequest, NextApiResponse } from "next";

interface Doctor {
  id: number;
  staff: {
    first_name: string;
    last_name: string;
    staff_avatar: string;
    medical_organization: Array<{
      id: number;
      name: string;
      phone: string;
      email: string;
      city: {
        id: number;
        name: string;
        foreign_name: string;
      };
    }>;
    city: {
      id: number;
      name: string;
      foreign_name: string;
    };
    address: string;
  };
  fixed_price: string;
  rating: number;
  is_consultant: boolean;
  appointments: Array<{
    id: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    appointment_status: string;
    price: string;
  }>;
  create_date: string;
  specialty: {
    id: number;
    name: string;
    foreign_name: string;
  };
  user: {
    phone: string;
  };
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Doctor;
  details?: any;
}

export default async function getDoctorById(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "Doctor ID is required and must be a valid string.",
      });
    }

    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({
        error: "CSRF token not configured",
      });
    }

    const doctorResponse = await fetch(
      `https://test-roshita.net/api/doctors/${id}/`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (!doctorResponse.ok) {
      const errorData = await doctorResponse.json();
      return res.status(doctorResponse.status).json({
        error: "Error from Roshita backend",
        details: errorData,
      });
    }

    const doctorData = await doctorResponse.json();

    // Fetch city details
    const cityId = doctorData.staff.city;
    const cityResponse = await fetch(
      `https://test-roshita.net/api/cities-list/`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (!cityResponse.ok) {
      const errorData = await cityResponse.json();
      return res.status(cityResponse.status).json({
        error: "Error fetching city data",
        details: errorData,
      });
    }

    const cityData = await cityResponse.json();

    // Find the city by ID
    const city = cityData.find((c: { id: number }) => c.id === cityId);
    if (!city) {
      return res.status(404).json({
        error: "City not found",
      });
    }

    // Update the city information in the doctor data
    doctorData.staff.city = {
      id: city.id,
      name: city.name,
      foreign_name: city.foreign_name,
    };

    return res.status(200).json({
      success: true,
      data: doctorData,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

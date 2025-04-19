import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of incoming request data for type safety
interface Staff {
  first_name: string;
  last_name: string;
  city: number;
  address: string;
}

interface AppointmentDate {
  scheduled_date: string; // Format: "YYYY-MM-DD"
  start_time: string; // Format: "HH:mm"
  end_time: string; // Format: "HH:mm"
}

interface CreateDoctorRequest {
  staff: Staff;
  specialty: number;
  fixed_price: string;
  rating: number;
  is_consultant: boolean;
  doctor_phone: string;
  appointment_dates: AppointmentDate[]; // Add appointment dates
}

// Response structure for frontend (optional, but recommended)
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: any; // Optional, for additional error details
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Request body:", req.body);
    const {
      staff,
      specialty,
      fixed_price,
      rating,
      is_consultant,
      appointment_dates,
      doctor_phone,
    } = req.body as CreateDoctorRequest;

    // Basic validation to ensure data integrity
    if (
      !staff ||
      !specialty ||
      !fixed_price ||
      rating == null ||
      is_consultant == null ||
      !appointment_dates ||
      !Array.isArray(appointment_dates) ||
      appointment_dates.length === 0 ||
      !doctor_phone // Ensure doctor_phone is also validated
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Validate appointment dates format
    for (const appointment of appointment_dates) {
      if (
        !appointment.scheduled_date ||
        !appointment.start_time ||
        !appointment.end_time
      ) {
        return res.status(400).json({
          error: "Invalid appointment date format",
          details: appointment,
        });
      }
    }

    const payload: CreateDoctorRequest = {
      staff,
      specialty,
      fixed_price,
      rating,
      is_consultant,
      doctor_phone, // Add doctor_phone to the payload
      appointment_dates,
    };

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Extract Bearer token from Authorization header
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: No bearer token provided",
      });
    }

    const authToken = authorizationHeader.split(" ")[1];

    // Send the POST request to the Swagger endpoint with the bearer token
    const response = await fetch("http://test-roshita.net/api/doctors/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: data || "Doctor and appointments created successfully",
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the response data for a single doctor
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
        country: {
          id: number;
          name: string;
          foreign_name: string;
        };
      };
    }>;
  };
}

// Extend ApiResponse to include details
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Doctor; // Single doctor data
  details?: any; // Raw response for debugging
}

/**
 * Fetch a doctor by their ID from the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Returns the details of the requested doctor.
 * - 400: Invalid query parameters.
 * - 404: Doctor not found.
 * - 500: Internal Server Error.
 */
export default async function getDoctorById(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Get the doctor ID from the URL parameters (captured by the dynamic [id] segment)
    const { id } = req.query;
    console.log("id", id); // Logs the id to the console for debugging
    console.log("test")

    const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token from the Authorization header

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }


    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Doctor ID is required and must be a valid string." });
    }

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Send the GET request to the API for the specific doctor by ID
    const response = await fetch(`https://test-roshita.net/api/doctors/${id}/`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${authToken}`, // Include Bearer token
        "X-CSRFToken": csrfToken,
      },
    });

    // Parse the response as JSON
    const data = await response.json();

    // Log the raw response data for debugging
    console.log("Raw API Response:", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data); // Log the error for debugging
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Forward detailed error for frontend debugging if needed
      });
    }

    // If the doctor is not found, return a 404 error
    if (!data || !data.staff) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Return the doctor data
    return res.status(200).json({
      success: true,
      data: data, // Single doctor data
    });
  } catch (error) {
    console.error("Error fetching doctor:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

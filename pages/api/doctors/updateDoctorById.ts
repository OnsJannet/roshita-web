import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure for the doctor's update payload
interface DoctorUpdatePayload {
  staff: {
    first_name: string;
    last_name: string;
    city: number;
    address: string;
  };
  specialty: number;
  fixed_price: string;
  rating: number;
  is_consultant: boolean;
  appointments: string[]; // Ensure this field is properly typed as an array of strings
}

// Extend the ApiResponse to handle success/error states
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any; // Updated doctor data
  details?: any; // Raw response for debugging
}

/**
 * Update a doctor's information in the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Returns the updated doctor data.
 * - 400: Invalid or missing parameters.
 * - 404: Doctor not found.
 * - 500: Internal Server Error.
 */
export default async function updateDoctorById(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Get the doctor ID from the URL parameters (captured by the dynamic [id] segment)
    const { id } = req.query;
    console.log("id", id); // Logs the id to the console for debugging

    const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token from the Authorization header

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    // Ensure the ID is provided and is a valid string
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Doctor ID is required and must be a valid string." });
    }

    // Ensure the request body contains valid data
    if (!req.body) {
      return res.status(400).json({ error: "No data provided to update." });
    }

    const {
      staff: { first_name, last_name, city, address },
      specialty,
      fixed_price,
      rating,
      is_consultant,
      appointments,
    }: DoctorUpdatePayload = req.body; // Ensure the correct typing for the request body

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !city ||
      !address ||
      specialty === undefined ||
      fixed_price === undefined ||
      rating === undefined ||
      is_consultant === undefined ||
      !appointments ||
      !Array.isArray(appointments) ||
      appointments.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields in the request body." });
    }

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Send the PUT request to the API for the specific doctor by ID
    const response = await fetch(`https://test-roshita.net/api/doctors/${id}/`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include Bearer token
        "X-CSRFToken": csrfToken, // CSRF token
      },
      body: JSON.stringify({
        staff: { first_name, last_name, city, address },
        specialty,
        fixed_price,
        rating,
        is_consultant,
        appointments,
      }),
    });

    // Parse the response as JSON
    const data = await response.json();

    // Log the raw response data for debugging
    console.log("Raw API Response:", data);

    // If the request fails, return an error response
    if (!response.ok) {
      console.error("Roshita backend error:", data); // Log the error for debugging
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Forward detailed error for frontend debugging if needed
      });
    }

    // If the doctor is not found or the update fails, return a 404 error
    if (!data || !data.staff) {
      return res.status(404).json({ error: "Doctor not found or update failed" });
    }

    // Return the updated doctor data
    return res.status(200).json({
      success: true,
      data: data, // Updated doctor data
    });
  } catch (error) {
    console.error("Error updating doctor:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

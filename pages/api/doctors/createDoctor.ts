import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of incoming request data for type safety
interface Staff {
  first_name: string;
  last_name: string;
  city: number;
  address: string;
}

interface CreateDoctorRequest {
  staff: Staff;
  specialty: number;
  fixed_price: string;
  rating: number;
  is_consultant: boolean;
}

// Response structure for frontend (optional, but recommended)
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: any; // Optional, for additional error details
}

/**
 * Handles the creation of a new doctor by sending a POST request
 * to an external API (Roshita backend).
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 * 
 * Request Body Example:
 * {
 *   "staff": {
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "city": 1,
 *     "address": "123 Main Street"
 *   },
 *   "specialty": 2,
 *   "fixed_price": "100",
 *   "rating": 4.5,
 *   "is_consultant": true
 * }
 *
 * Environment Variables:
 * - CSRF_TOKEN: The CSRF token required for authentication with the external API.
 *
 * Responses:
 * - 200: Doctor created successfully.
 * - 400: Invalid input data or error from the external API.
 * - 405: Method not allowed (only POST is supported).
 * - 500: Internal Server Error (e.g., missing CSRF token or unexpected error).
 *
 * Notes:
 * - The function performs basic validation on the input data to ensure integrity.
 * - Any errors from the external API are logged and returned to the client for debugging.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { staff, specialty, fixed_price, rating, is_consultant } =
      req.body as CreateDoctorRequest;

    // Basic validation to ensure data integrity
    if (
      !staff ||
      !specialty ||
      !fixed_price ||
      rating == null ||
      is_consultant == null
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const payload: CreateDoctorRequest = {
      staff,
      specialty,
      fixed_price,
      rating,
      is_consultant,
    };

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Extract Bearer token from Authorization header
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No bearer token provided" });
    }

    const authToken = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
    console.log("authToken", authToken)

    // Send the POST request to the Swagger endpoint with the bearer token
    const response = await fetch("https://test-roshita.net/api/doctors/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "Authorization": `Bearer ${authToken}`, // Add bearer token to request headers
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("respodatanse", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data); // Log the error for debugging
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Forward detailed error for frontend debugging if needed
      });
    }

    // Return a sanitized response to the frontend
    return res.status(200).json({
      success: true,
      message: data || "Doctor created successfully",
    });
  } catch (error) {
    console.error("Error creating doctor:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the incoming request data for type safety
interface LoginStaffRequest {
  phone: string;
  password: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: any; // Optional, for additional error details
  token?: string;
  refreshToken?: string;
}

/**
 * Handles the staff login by sending a POST request
 * to the Roshita backend API for authentication.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Request Body Example:
 * {
 *   "phone": "string",
 *   "password": "string"
 * }
 *
 * Environment Variables:
 * - CSRF_TOKEN: The CSRF token required for authentication with the external API.
 *
 * Responses:
 * - 200: Staff logged in successfully.
 * - 400: Invalid input data or error from the external API.
 * - 405: Method not allowed (only POST is supported).
 * - 500: Internal Server Error (e.g., missing CSRF token or unexpected error).
 */
export default async function loginStaff(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Destructure the necessary fields from the request body
    const { phone, password } = req.body as LoginStaffRequest;

    // Basic validation to ensure required data is provided
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password are required" });
    }

    // Prepare the payload to send to the backend API
    const payload: LoginStaffRequest = {
      phone,
      password,
    };

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Send the POST request to the Roshita backend for login
    const response = await fetch(
      "https://test-roshita.net/api/auth/staff-login/",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      }
    );

    // Parse the JSON response from the API
    const data = await response.json();

    // If the response is not successful, log the error and return it
    if (!response.ok) {
      console.error("Roshita backend error:", data); // Log the error for debugging
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Forward detailed error for frontend debugging if needed
      });
    }

    // Extract tokens from the response
    const { access, refresh } = data;

    // Return the tokens and a success message
    return res.status(200).json({
      success: true,
      message: "Staff logged in successfully",
      token: access,
      refreshToken: refresh,
    });
  } catch (error) {
    // Log unexpected errors to help with debugging
    console.error("Error logging in staff:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

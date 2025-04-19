import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the profile detail response
interface ProfileDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar_url?: string;
  // Add any other fields returned by the API
}

// Define the API response type
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: ProfileDetail;
  details?: any; // Raw response for debugging
}

/**
 * Fetch profile details from the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Returns the profile details.
 * - 400: Invalid request or missing CSRF token.
 * - 401: Missing or invalid token.
 * - 500: Internal Server Error.
 */
export default async function getProfileDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const csrfToken = process.env.CSRF_TOKEN;
    
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    const authToken = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
    console.log("authToken", authToken);

    // Send the GET request to the API with the CSRF token
    const response = await fetch("http://test-roshita.net/api/account/profile/detail//", {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Ensure this is a string
        Authorization: `Bearer ${authToken}`,
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

    // Return the profile details
    return res.status(200).json({
      success: true,
      data: data as ProfileDetail, // Ensure the structure matches the ProfileDetail interface
    });
  } catch (error) {
    console.error("Error fetching profile details:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

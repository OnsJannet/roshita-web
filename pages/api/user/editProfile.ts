import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the profile edit request
interface ProfileEditRequest {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string; // Optional phone number
  };
  gender: string;
  birthday: string;
  city: number | null; // Allowing null if no city is provided
  user_type: number;
  address: string;
  avatar?: string; // Optional avatar image URL
}

// Define the API response type
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any; // Raw response for debugging
  details?: any; // Raw response for debugging
}

/**
 * Edit profile details in the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Successfully updated profile.
 * - 400: Invalid request or missing CSRF token.
 * - 401: Missing or invalid token.
 * - 500: Internal Server Error.
 */
export default async function editProfileDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Ensure the request method is POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Extract the CSRF token from the environment
    const csrfToken = process.env.CSRF_TOKEN;
    
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Extract the auth token from the Authorization header
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    // Extract the profile data from the request body
    const {
      user,
      gender,
      birthday,
      city,
      user_type,
      address,
      avatar,
    }: ProfileEditRequest = req.body;

    // Construct the request body for the API call
    const bodyData = {
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone, // Include phone if available
      },
      gender,
      birthday,
      city,
      user_type,
      address,
      avatar, // Include avatar if available
    };

    // Send the POST request to the API with the CSRF token and the profile data
    const response = await fetch("https://test-roshita.net/api/account/profile/edit/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Ensure this is a string
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bodyData), // Send the request body as JSON
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

    // Return success response if the profile was updated
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: data, // You can return any relevant data from the response
    });
  } catch (error) {
    console.error("Error updating profile details:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

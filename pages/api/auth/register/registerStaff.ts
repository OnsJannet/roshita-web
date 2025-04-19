import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the incoming request data for type safety
interface MedicalOrganization {
  name: string;
  foreign_name: string;
  phone: string;
  email: string;
  city: {
    country: {
      name: string;
      foreign_name: string;
    };
    name: string;
    foreign_name: string;
  };
  address: string;
  Latitude: number;
  Longitude: number;
  type: number;
}

interface RegisterStaffRequest {
  user: {
    phone: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  city: number;
  address: string;
  medical_organization: MedicalOrganization[];
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: any; // Optional, for additional error details
}

/**
 * Handles the registration of staff by sending a POST request
 * to the Roshita backend API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 * 
 * Request Body Example:
 * {
 *   "user": {
 *     "phone": "123456789",
 *     "password": "Roshita2014",
 *     "email": "user@example.com",
 *     "first_name": "John",
 *     "last_name": "Doe"
 *   },
 *   "city": 1,
 *   "address": "string",
 *   "medical_organization": [
 *     {
 *       "name": "string",
 *       "foreign_name": "string",
 *       "phone": "string",
 *       "email": "hospital@example.com",
 *       "city": {
 *         "country": {
 *           "name": "string",
 *           "foreign_name": "string"
 *         },
 *         "name": "string",
 *         "foreign_name": "string"
 *       },
 *       "address": "string",
 *       "Latitude": 0,
 *       "Longitude": 0,
 *       "type": 1
 *     }
 *   ]
 * }
 *
 * Environment Variables:
 * - CSRF_TOKEN: The CSRF token required for authentication with the external API.
 *
 * Responses:
 * - 200: Staff registered successfully.
 * - 400: Invalid input data or error from the external API.
 * - 405: Method not allowed (only POST is supported).
 * - 500: Internal Server Error (e.g., missing CSRF token or unexpected error).
 */
export default async function registerStaff(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, city, address, medical_organization } =
      req.body as RegisterStaffRequest;

    // Basic validation to ensure data integrity
    if (!user || !city || !address || !medical_organization) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const payload: RegisterStaffRequest = {
      user,
      city,
      address,
      medical_organization,
    };

    console.log("payload", payload)

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Send the POST request to the Swagger endpoint
    const response = await fetch(
      "http://test-roshita.net/api/auth/staff-register/",
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

    const data = await response.json();

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
      message: "Staff registered successfully",
    });
  } catch (error) {
    console.error("Error registering staff:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

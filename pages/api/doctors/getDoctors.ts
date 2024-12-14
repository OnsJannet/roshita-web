import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the response data
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
  data?: Doctor[]; // List of doctors
  total?: number; // Total count of doctors
  nextPage?: string; // URL to the next page
  previousPage?: string; // URL to the previous page
  details?: any; // Raw response for debugging
}

/**
 * Fetch doctors list from the Roshita API with pagination.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Returns the list of doctors.
 * - 400: Invalid query parameters.
 * - 401: Missing or invalid token.
 * - 500: Internal Server Error.
 */
export default async function getDoctors(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token from the Authorization header

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    // Pagination query parameters (page number)
    const page = req.query.page || 1;

    // Send the GET request to the API with Bearer token
    const response = await fetch(`https://test-roshita.net/api/doctors/?page=${page}&limit=10`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${authToken}`, // Include Bearer token
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

    // Check if the response contains the expected structure
    if (!data || !data.results) {
      console.error("Unexpected response format:", data); // Log the structure of the response
      return res.status(500).json({ error: "Unexpected response format", details: data });
    }

    // Return the list of doctors with pagination details
    return res.status(200).json({
      success: true,
      data: data.results, // doctors are in the 'results' field
      total: data.count, // total number of doctors
      nextPage: data.next, // link to the next page of results
      previousPage: data.previous, // link to the previous page of results
    });
  } catch (error) {
    console.error("Error fetching doctors:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

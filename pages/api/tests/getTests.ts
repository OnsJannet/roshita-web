import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the response data for tests
interface Test {
  id: number;
  title: string;
  price: string;
  open_date: string;
  close_date: string;
  medical_services: {
    id: number;
    name: string;
  };
  medical_services_category: {
    id: number;
    name: string;
  };
  medical_organization: {
    id: number;
    name: string;
  };
  medical_services_id: number;
  medical_services_category_id: number;
}

// Extend ApiResponse to include test-specific details
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Test[]; // List of tests
  total?: number; // Total count of tests
  nextPage?: string; // URL to the next page
  previousPage?: string; // URL to the previous page
  details?: any; // Raw response for debugging
}

/**
 * Fetch tests list from the Roshita API without caching.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Returns the list of tests.
 * - 400: Invalid query parameters.
 * - 401: Missing or invalid token.
 * - 500: Internal Server Error.
 */
export default async function getTests(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const authToken = req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    const page = req.query.page || 1;

    // Fetch fresh data from the API
    const response = await fetch(
      `https://test-roshita.net/api/guide-medical/by-type/2/`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    const results = Array.isArray(data) ? data : [];

    const apiResponse: ApiResponse = {
      success: true,
      data: results,
      total: results.length,
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

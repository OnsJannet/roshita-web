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

// Simple in-memory cache
const cache = new Map<string, { data: ApiResponse; expiry: number }>();

/**
 * Fetch tests list from the Roshita API with caching and pagination.
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
    const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token from the Authorization header

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    // Pagination query parameters (page number)
    const page = req.query.page || 1;

    // Cache key based on page number
    const cacheKey = `tests-page-${page}`;
    const cacheTTL = 60 * 5 * 1000; // Cache expiry time (5 minutes)

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      console.log("Returning cached data for:", cacheKey);
      return res.status(200).json(cached.data);
    }

    // Send the GET request to the API with Bearer token
    const response = await fetch(
      `https://test-roshita.net/api/guide-medical/?page=${page}&limit=10`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`, // Include Bearer token
        },
      }
    );

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
      return res
        .status(500)
        .json({ error: "Unexpected response format", details: data });
    }

    // Prepare the API response
    const apiResponse: ApiResponse = {
      success: true,
      data: data.results, // tests are in the 'results' field
      total: data.count, // total number of tests
      nextPage: data.next, // link to the next page of results
      previousPage: data.previous, // link to the previous page of results
    };

    // Cache the response
    cache.set(cacheKey, { data: apiResponse, expiry: Date.now() + cacheTTL });

    // Return the API response
    return res.status(200).json(apiResponse);
  } catch (error) {
    console.error("Error fetching tests:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

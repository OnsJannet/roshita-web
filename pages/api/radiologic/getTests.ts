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
// Import statements remain the same

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
    const cacheKey = `tests-page-${page}`;
    const cacheTTL = 60 * 5 * 1000;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      console.log("Returning cached data for:", cacheKey);
      return res.status(200).json(cached.data);
    }

    const response = await fetch(
      `https://test-roshita.net/api/guide-medical/by-type/3/`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = await response.json();

    console.log("Raw API Response:", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    // Validate and normalize the response
    const results = Array.isArray(data) ? data : []; // Fix for API response structure

    // Handle empty results array
    if (results.length === 0) {
      console.log("Empty results array detected.");
      return res.status(200).json({
        success: true,
        data: [],
        total: results.length,
        //nextPage: null,
        //previousPage: null,
      });
    }

    const apiResponse: ApiResponse = {
      success: true,
      data: results,
      total: results.length,
      //nextPage: null, // No pagination details in the raw response
      //previousPage: null,
    };

    cache.set(cacheKey, { data: apiResponse, expiry: Date.now() + cacheTTL });

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}




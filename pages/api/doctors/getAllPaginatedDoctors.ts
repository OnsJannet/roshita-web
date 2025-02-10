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

// Define the structure of paginated responses
interface PaginatedResponse {
  count: number; // Total number of items
  next: string | null; // URL for the next page
  previous: string | null; // URL for the previous page
  results: Doctor[]; // List of doctors
}

// Extend ApiResponse to include details
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Doctor[]; // List of doctors
  total?: number; // Total count of doctors
  details?: any; // Optional raw details for debugging
}

/**
 * Fetch all doctors from all pages of the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 */
export default async function getAllPaginatedDoctors(
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

    const baseUrl = `https://test-roshita.net/api/doctors/?limit=5`;
    let allDoctors: Doctor[] = [];
    let nextPageUrl: string | null = baseUrl;

    // Fetch all pages sequentially
    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`, // Include Bearer token
        },
      });

      const data: PaginatedResponse = await response.json();

      if (!response.ok) {
        console.error("Roshita backend error:", data);
        return res.status(response.status).json({
          error: "Error from Roshita backend",
          details: data,
        });
      }

      // Collect doctors from this page
      if (data.results) {
        allDoctors = allDoctors.concat(data.results);
      }

      // Update nextPageUrl for the next iteration
      nextPageUrl = data.next;
    }

    return res.status(200).json({
      success: true,
      data: allDoctors, // All doctors aggregated
      total: allDoctors.length, // Total count
    });
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

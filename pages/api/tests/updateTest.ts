import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the request body
interface UpdateTestRequest {
  price: string;
  open_date: string;
  close_date: string;
  medical_services: {
    name: string;
  };
  medical_services_category: {
    name: string;
  };
  medical_organization: {
    name: string;
  };
  medical_services_id: number;
  medical_services_category_id: number;
}

// Define the structure of the response data
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any; // Data returned from the PUT request
  details?: any; // Add details to the response structure
}

/**
 * Handles updating a test resource in the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Update successful.
 * - 400: Invalid request or missing data.
 * - 401: Missing or invalid token.
 * - 500: Internal Server Error.
 */
export default async function updateTest(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    const testId = req.query.id; // Extract the test ID from query parameters
    console.log("testId", testId)
    if (!testId) {
      return res.status(400).json({
        error: "Missing test ID in request",
      });
    }

    const body: UpdateTestRequest = req.body; // Ensure the request body matches the expected structure

    // Send the PUT request to the Roshita API
    const response = await fetch(
      `https://test-roshita.net/api/laboratory-guide-medical/${testId}/`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Now it's allowed since 'details' is added to ApiResponse
      });
    }

    // Prepare the API response
    return res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error updating test:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

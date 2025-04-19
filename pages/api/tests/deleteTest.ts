import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the response data
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: any; // Add details to the response structure
}

/**
 * Handles deleting a test resource in the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse<ApiResponse>} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Deletion successful.
 * - 400: Invalid request or missing data.
 * - 401: Missing or invalid token.
 * - 500: Internal Server Error.
 */
export default async function deleteTest(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "DELETE") {
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

    if (!testId) {
      return res.status(400).json({
        error: "Missing test ID in request",
      });
    }

    // Send the DELETE request to the Roshita API
    const response = await fetch(
      `http://test-roshita.net/api/laboratory-guide-medical/${testId}/`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Include error details from Roshita API
      });
    }

    // Prepare the API response
    return res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting test:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

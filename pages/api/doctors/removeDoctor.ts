import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Delete a doctor's information by ID from the Roshita API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse} res - The outgoing HTTP response object.
 *
 * Responses:
 * - 200: Successfully deleted the doctor.
 * - 400: Invalid or missing parameters.
 * - 404: Doctor not found.
 * - 500: Internal Server Error.
 */
export default async function removeDoctor(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    console.log("id", id); // Logs the id to the console for debugging

    const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token from the Authorization header

    if (!authToken) {
      return res.status(401).json({
        error: "Missing or invalid authorization token",
      });
    }

    // Ensure the ID is provided and is a valid string
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Doctor ID is required and must be a valid string." });
    }

    // Fetch CSRF token from environment variables
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Send the DELETE request to the API for the specific doctor by ID
    const response = await fetch(`https://test-roshita.net/api/doctors/${id}/`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${authToken}`, // Include Bearer token
        "X-CSRFToken": csrfToken, // CSRF token
      },
    });

    // Check if the response status is 404, which means the doctor was not found
    if (response.status === 404) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Parse the response as JSON only if it's not empty or non-JSON
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      // Handle non-JSON responses (e.g., plain text errors)
      return res.status(response.status).json({
        error: "Error parsing response from Roshita backend",
        details: await response.text(), // You can inspect this to see the raw response body
      });
    }

    // If the request fails, return an error response
    if (!response.ok) {
      console.error("Roshita backend error:", data); // Log the error for debugging
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data, // Forward detailed error for frontend debugging if needed
      });
    }

    // If the doctor is not found or the deletion fails, return a 404 error
    if (!data || data.error) {
      return res.status(404).json({ error: "Doctor not found or deletion failed" });
    }

    // Return a success message
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doctor:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

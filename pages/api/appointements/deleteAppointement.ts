import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract CSRF token and appointment ID from the request
  const csrfToken = process.env.CSRF_TOKEN;
  if (!csrfToken) {
    return res.status(500).json({ error: "CSRF token not configured" });
  }

  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No bearer token provided" });
  }

  const authToken = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  // Extract the appointment ID from the query parameters
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing appointment ID" });
  }

  try {
    const apiResponse = await fetch(
      `https://test-roshita.net/api/appointment-reservations/${id}/`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "X-CSRFToken": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("API Error:", errorData);
      return res.status(apiResponse.status).json({ error: errorData });
    }

    // Successfully deleted
    return res
      .status(200)
      .json({ message: `Appointment reservation ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

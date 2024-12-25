import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the request body for adding a test
interface AddTestRequest {
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

// Define the structure of the response data for added test
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

/**
 * Handle adding a new test to the external API.
 *
 * @param {NextApiRequest} req - The incoming HTTP request object.
 * @param {NextApiResponse} res - The outgoing HTTP response object.
 */
export default async function addTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {

      const authToken = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token

      if (!authToken) {
        return res.status(401).json({
          error: "Missing or invalid authorization token",
        });
      }

      const {
        price,
        open_date,
        close_date,
        medical_services,
        medical_services_category,
        medical_organization,
        medical_services_id,
        medical_services_category_id,
      }: AddTestRequest = req.body;

      if (
        !price ||
        !open_date ||
        !close_date ||
        !medical_services ||
        !medical_services_category ||
        !medical_organization ||
        !medical_services_id ||
        !medical_services_category_id
      ) {
        return res.status(400).json({
          error: "Missing required fields",
        });
      }

      // Prepare the payload for the external API
      const payload = {
        price,
        open_date,
        close_date,
        medical_services: {
          name: medical_services.name,
        },
        medical_services_category: {
          name: medical_services_category.name,
        },
        medical_organization: {
          name: medical_organization.name,
        },
        medical_services_id,
        medical_services_category_id,
      };

      // Make the POST request to the external API
      const externalResponse = await fetch(
        "https://test-roshita.net/api/guide-medical/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const externalData = await externalResponse.json();

      if (!externalResponse.ok) {
        return res.status(externalResponse.status).json({
          error: "Error from external API",
          details: externalData,
        });
      }

      // Forward the response from the external API to the client
      return res.status(201).json({
        success: true,
        message: "Test added successfully to the external API",
        data: externalData,
      });
    } catch (error) {
      console.error("Error adding test:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Method Not Allowed for any request other than POST
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

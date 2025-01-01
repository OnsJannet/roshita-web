import type { NextApiRequest, NextApiResponse } from "next";

interface Service {
  medical_services_category: {
    full_path: string;
  };
  price: string;
}

interface Lab {
  name: string;
  services: Service[];
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Lab[];
  total?: number;
  details?: any;
}

export default async function getLabs(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Extract the CSRF token from the environment
    const csrfToken = process.env.CSRF_TOKEN;

    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    const response = await fetch("https://test-roshita.net/api/user-labs-list/", {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    const data = await response.json();
    console.log("Labs list:", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    // Parse the labs array from the responses
    const labs: Lab[] = data;

    return res.status(200).json({
      success: true,
      data: labs,
      total: labs.length,
    });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

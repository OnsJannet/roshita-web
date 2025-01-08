import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

interface LoginStaffRequest {
  phone: string;
  password: string;
}

interface User {
  user_id: number;
  phone: string;
  is_verified: boolean;
  medical_organization: string | null;
  staff_groups: string[];
  staff_permissions: string[];
  user_type: string;
  staff: any;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: any; // Optional, for additional error details
  token?: string;
  refreshToken?: string;
  user?: User; // Added user info in the response
}

export default async function loginStaff(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    console.log("Request method is not POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone, password } = req.body as LoginStaffRequest;
    console.log("Received phone and password:", { phone, password });

    if (!phone || !password) {
      console.log("Phone or password is missing");
      return res.status(400).json({ error: "Phone and password are required" });
    }

    const payload: LoginStaffRequest = { phone, password };

    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      console.log("CSRF token is not configured");
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    console.log("Making request to backend with payload:", payload);
    const response = await fetch(
      "https://test-roshita.net/api/auth/staff-login/",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      }
    );

    // Log the raw response as text before parsing
    const rawResponse = await response.text();
    console.log("Raw response from backend:", rawResponse); // This will show what the backend is returning

    // Now try to parse the response and log the data
    try {
      const data = JSON.parse(rawResponse);
      console.log("Parsed response from backend:", data);
      
      if (!response.ok) {
        console.error("Roshita backend error:", data);
        return res.status(response.status).json({
          error: "Error from Roshita backend",
          details: data,
        });
      }

      const { access, refresh, user } = data;
      console.log("Setting cookie with user data:", user);

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("user", JSON.stringify(user.user_type), {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        })
      );

      console.log("Cookie set successfully");

      return res.status(200).json({
        success: true,
        message: "Staff logged in successfully",
        token: access,
        refreshToken: refresh,
        user: user,
      });
    } catch (jsonError) {
      // This will catch any error that happens during JSON.parse
      console.error("Error parsing JSON response:", jsonError);
      console.error("Response text was:", rawResponse); // Log the raw response before parsing
      return res.status(500).json({
        error: "Failed to parse backend response",
        details: rawResponse,
      });
    }

  } catch (error) {
    console.error("Error logging in staff:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

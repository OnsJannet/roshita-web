import type { NextApiRequest, NextApiResponse } from "next";

type Patient = {
  first_name: string;
  last_name: string;
  relative: string;
  phone: string;
  email: string;
  city: number;
  address: string;
};

type Reservation = {
  reservation: {
    patient: Patient;
    reservation_date: string;
  };
  medical_organizations: number;
  doctor: number;
  price: string;
  payment: {
    payment_method: string;
    mobile_number: string;
    birth_year: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Fetch CSRF token from environment variables
  const csrfToken = process.env.CSRF_TOKEN;
  if (!csrfToken) {
    return res.status(500).json({ error: "CSRF token not configured" });
  }

  // Extract Bearer token from Authorization header
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No bearer token provided" });
  }

  const authToken = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
  console.log("authToken", authToken);

  const {
    reservation,
    medical_organizations,
    doctor,
    price,
    payment,
  }: Reservation = req.body;

  try {
    const apiResponse = await fetch(
      "https://test-roshita.net/api/user-appointment-reservations/",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          reservation,
          medical_organizations,
          doctor,
          price,
          payment,
        }),
      }
    );

    // Check response status and parse data
    const data = await apiResponse.json();
    console.log("API Response Status:", apiResponse.status);
    console.log("API Response Data:", data);

    if (!apiResponse.ok) {
      // If API response is not OK, return the error
      console.error("API Error:", data);
      return res.status(apiResponse.status).json({ error: data });
    }

    // Successful response
    console.log("Successfully received response from API:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error making reservation:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}


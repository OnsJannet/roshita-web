import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

// Define the structure of the profile edit request
interface ProfileEditRequest {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string; // Optional phone number
  };
  gender: string;
  birthday: string;
  city: number | null; // Allowing null if no city is provided
  user_type: number;
  address: string;
  avatar?: File; // Optional avatar image file
}

// Define the API response type
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any; // Raw response for debugging
  details?: any; // Raw response for debugging
}

/**
 * Parse FormData request
 */
const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

/**
 * Edit profile details in the Roshita API.
 */
export default async function editProfileDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Ensure the request method is POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Extract the CSRF token from the environment
    const csrfToken = process.env.CSRF_TOKEN;
    if (!csrfToken) {
      return res.status(500).json({ error: "CSRF token not configured" });
    }

    // Extract the auth token from the Authorization header
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    // Parse the FormData request
    const { fields, files } = await parseForm(req);

    // Extract the profile data from the parsed fields
    const user = {
      first_name: fields["user[first_name]"],
      last_name: fields["user[last_name]"],
      email: fields["user[email]"],
      phone: fields["user[phone]"] || undefined, // Optional field
    };

    const gender = fields.gender;
    const birthday = fields.birthday;
    const city = fields.city ? parseInt(fields.city, 10) : null;
    const user_type = parseInt(fields.user_type, 10);
    const address = fields.address;
    const avatar = files.avatar ? fs.createReadStream(files.avatar.filepath) : undefined;

    // Construct the FormData object for the external API
    const formData = new FormData();
    formData.append("user[first_name]", user.first_name);
    formData.append("user[last_name]", user.last_name);
    formData.append("user[email]", user.email);
    if (user.phone) {
      formData.append("user[phone]", user.phone);
    }
    formData.append("gender", gender);
    formData.append("birthday", birthday);
    if (city !== null) {
      formData.append("city", city.toString());
    }
    formData.append("user_type", user_type.toString());
    formData.append("address", address);
    if (avatar) {
      //@ts-ignore
      formData.append("avatar", avatar);
    }

    // Send the POST request to the external API
    const response = await fetch("http://test-roshita.net/api/account/profile/edit/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-CSRFToken": csrfToken,
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    // Parse the response as JSON
    const data = await response.json();

    // Log the raw response data for debugging
    console.log("Raw API Response:", data);

    if (!response.ok) {
      console.error("Roshita backend error:", data);
      return res.status(response.status).json({
        error: "Error from Roshita backend",
        details: data,
      });
    }

    // Return success response if the profile was updated
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error updating profile details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Disable Next.js body parsing to allow formidable to handle it
export const config = {
  api: {
    bodyParser: false,
  },
};
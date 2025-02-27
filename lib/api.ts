interface UserData {
    username: string;
    password: string;
    email?: string;
    // Add other fields as per your requirements
  }
  
  interface LoginData {
    phone: string;
    password: string;
  }
  
  interface OTPData {
    otp: string;
    // Add other fields as per your requirements
  }
  
  interface DoctorData {
    doctor_id: number;
  }
  
  interface OrganizationData {
    org_id: number;
    page: number;
    limit: number;
  }
  
  interface Doctor {
    id: number;
    name: string;
    price?: number;
    // Add other doctor fields as per your response structure
  }
  
  interface ApiResponse<T> {
    results: {
      data: T;
    };
    next: string | null;
  }


  interface EditProfileData {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    gender: string;  // "male", "female", etc.
    service_country: number;  // assuming this is an ID for a country
    birthday: string;  // ISO date string
    city: number;  // assuming this is an ID for the city
    user_type: number;  // assuming this is an ID for user type
    address: string;
  }

  
  /**
   * Registers a new user by making a POST request.
   */
  export const registerUser = async (userData: UserData): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/account/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };
  
  /**
   * Logs out a user by making a POST request.
   */
  export const logoutUser = async (refreshToken: string, accessToken: string): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/account/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("Error logging out user:", error);
      throw error;
    }
  };
  
  /**
   * Logs in a user by making a POST request.
   */
  export const loginUser = async (loginData: LoginData): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/account/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
  
      if (!response.ok) {
        // If the status is not OK, throw an error with the status and message
        const errorData = await response.json();
        console.log("Error: ", errorData)
        throw new Error(errorData.detail || 'Login failed due to server error');
      }
  
      // Return the response JSON if the status is OK
      return response.json();
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  };
  
  
  
  /**
   * Verifies an OTP by making a POST request.
   */
  export const verifyOTP = async (otpData: OTPData): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/account/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpData),
      });
      return response.json();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };
  
  /**
   * Fetches the medical guide list by making a GET request.
   */
  export const getMedicalGuideList = async (): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/medical-services-list/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching medical guide list:", error);
      throw error;
    }
  };
  
  /**
   * Fetches the specialty list by making a GET request.
   */
  export const getSpecialtyList = async (): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/specialty-list/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching specialty list:", error);
      throw error;
    }
  };
  
  /**
   * Fetches doctor details by making a POST request.
   */
  export const getDoctorDetails = async (doctorData: DoctorData): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/doctor-view/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      throw error;
    }
  };
  
  /**
   * Fetches doctors by organization ID.
   */
  export const getDoctorsByOrganizationId = async (orgId: number, page = 1, limit = 10): Promise<any> => {
    try {
      const response = await fetch("https://test-roshita.net/api/organization-staff-service-list/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ org_id: orgId, page, limit }),
      });
      return response.json();
    } catch (error) {
      console.error(`Error fetching doctors for organization ID ${orgId}:`, error);
      throw error;
    }
  };
  
  /**
   * Fetches all doctors by making sequential requests.
   */
  export const fetchDoctorsFromAllOrganizations = async (): Promise<Doctor[]> => {
    try {
      const allDoctors: Doctor[] = [];
  
      for (let doctorId = 1; doctorId <= 10; doctorId++) {
        const doctorData: DoctorData = { doctor_id: doctorId };
        const response = await fetch("https://test-roshita.net/api/doctor-view/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: JSON.stringify(doctorData),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Assuming 'price' is part of the doctor data
        allDoctors.push({
          ...data.doctor,
          price: data.price,
        });
      }
  
      return allDoctors;
    } catch (error) {
      console.error("Error fetching doctors from all organizations:", error);
      throw error;
    }
  };
  
  /**
   * Fetches the list of doctors by making a GET request.
   */
  export const getDoctorsList = async (page: number): Promise<any> => {
    try {
      const response = await fetch(`https://test-roshita.net/api/doctors-list/?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching doctors list:", error);
      throw error;
    }
  };
  
  /**
   * Fetches all doctors by making paginated GET requests.
   */
  export const getAllDoctorsList = async (): Promise<Doctor[]> => {
    try {
      let allDoctors: Doctor[] = [];
      let nextPage: string | null = "https://test-roshita.net/api/doctors-list/?page=1";
  
      while (nextPage) {
        const response = await fetch(nextPage, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data: ApiResponse<{ doctors: Doctor[] }> = await response.json();
  
        data.results.data.doctors.forEach((doctor, index) => {
          allDoctors.push({ ...doctor, id: index + 1 });
        });
  
        nextPage = data.next;
      }
  
      return allDoctors;
    } catch (error) {
      console.error("Error fetching all doctors list:", error);
      throw error;
    }
  };
  
/**
 * Fetches profile details using the access token from localStorage.
 */
export const fetchProfileDetails = async (): Promise<any> => {
  console.log("entered fetchProfileDetails")
  try {
    // Retrieve the access token from localStorage
    const token = localStorage.getItem('access');

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    // Make the API request with Bearer token in the Authorization header
    const response = await fetch("https://test-roshita.net/api/account/profile/detail/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Error fetching profile details: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return response.json();
  } catch (error) {
    console.error("Error fetching profile details:", error);
    throw error;
  }
};



/**
 * Edits the user profile by making a POST request to the profile edit API.
 */
export const editUserProfile = async (profileData: EditProfileData, accessToken: string): Promise<any> => {
  try {
    const response = await fetch("https://test-roshita.net/api/account/profile/edit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Error updating profile: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};



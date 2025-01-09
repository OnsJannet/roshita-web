"use client"
import { useEffect, useState } from "react";
import { redirect } from "next/navigation"; // Use redirect for server-side redirect

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    console.log("storedUser", storedUser)

    if (!storedUser) {
      // If no user is found in localStorage, redirect to the access-denied page
      console.log("entered Denied")
      redirect("/access-denied");
      return;
    }

    // Handle case where storedUser is a simple string like "staff"
    /*if (storedUser === "staff" || storedUser === "Admin") {
      // You can handle this special case where the value is just "staff"
      redirect("/access-denied");
      return;
    }*/

    try {
      // Try parsing the stored user data as JSON
      const parsedUser = JSON.parse(storedUser);
      console.log("parsedUser", parsedUser.user_type)

      // If the user doesn't have the "staff" role, redirect to the access-denied page
      if (parsedUser.medical_organization_type !== "Laboratory" && parsedUser.medical_organization_type !== "hospital" && parsedUser.medical_organization_type !== "Radiologic") {
        console.log("entered if (parsedUser.user_type !== staff || parsedUser.user_type !== Admin) {")
        redirect("/access-denied");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      // Handle parsing errors
      console.error("Error parsing user data:", error);
      redirect("/access-denied");
    }
  }, []);

  // Check if the user is available, if not, render loading or nothing until the check is done
  if (!user) {
    return null; // Or show a loading spinner
  }

  console.log("dashboard");

  return <>{children}</>;
}

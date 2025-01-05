import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Language = "ar" | "en";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthHOC = (props: any) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const isLoggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") === "true";
    const intendedRoute =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const [language, setLanguage] = useState<Language>("ar");

    useEffect(() => {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setLanguage(storedLanguage as Language);
      } else {
        setLanguage("ar");
      }

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "language") {
          setLanguage((event.newValue as Language) || "ar");
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

    useEffect(() => {
      if (!isLoggedIn) {
        // Redirect to login page with the intended route as a query parameter
        router.push(`/login?redirect=${encodeURIComponent(intendedRoute)}`);
      } else {
        setLoading(false);
      }
    }, [isLoggedIn, intendedRoute, router]);

    // Optionally, show a loading spinner while redirecting
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen text-lg font-semibold">
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      ); // You can customize this as needed
    }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;

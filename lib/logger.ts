// utils/logger.ts

export async function logAction(
    token: string | undefined, // Accept string or undefined
    endpoint: string,
    requestData: Record<string, any>,
    status: "success" | "error",
    statusCode?: number,
    errorMessage?: string
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString(); // Get the current timestamp
      const day = new Date().toLocaleDateString(); // Get the current day
  
      await fetch("/api/logs/Logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          endpoint,
          requestData: { ...requestData, timestamp, day },
          status,
          statusCode,
          errorMessage,
        }),
      });
    } catch (error) {
      console.error("Failed to log action:", error);
    }
  }
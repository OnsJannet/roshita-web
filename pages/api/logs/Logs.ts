import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Define the path to the log file
const logFilePath = path.join(process.cwd(), "logs.txt");

// Define types for the log entry
interface LogEntry {
  timestamp: string;
  token?: string; // Make token optional
  endpoint: string;
  requestData: Record<string, any>;
  status: "success" | "error";
  statusCode?: number;
  errorMessage?: string;
}

// Helper function to get the current timestamp
function getTimestamp(): string {
  return new Date().toISOString();
}

// Helper function to read logs from the file
function readLogs(): LogEntry[] {
  if (!fs.existsSync(logFilePath)) {
    return [];
  }
  const logData = fs.readFileSync(logFilePath, "utf8");
  return logData
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line));
}

// Helper function to write logs to the file
function writeLog(
  token: string | undefined, // Make token optional
  endpoint: string,
  requestData: Record<string, any>,
  status: "success" | "error",
  statusCode?: number,
  errorMessage?: string
): void {
  const timestamp = getTimestamp();
  const logEntry: LogEntry = {
    timestamp,
    token,
    endpoint,
    requestData,
    status,
    statusCode,
    errorMessage,
  };
  fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + "\n");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Save a new log entry
    const { token, endpoint, requestData, status, statusCode, errorMessage } = req.body;

    // Validate required fields (excluding token)
    if (!endpoint || !requestData || !status) {
      return res.status(400).json({ error: "endpoint, requestData, and status are required" });
    }

    writeLog(token, endpoint, requestData, status, statusCode, errorMessage);
    return res.status(200).json({ message: "Log saved successfully" });
  } else if (req.method === "GET") {
    // Retrieve all logs
    const logs = readLogs();
    return res.status(200).json(logs);
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: "Method not allowed" });
  }
}
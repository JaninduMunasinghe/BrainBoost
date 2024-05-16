import dotenv from "dotenv";
import { execSync } from "child_process";
import os from "os";

dotenv.config();

const getHostIpAddress = () => {
  try {
    // check if running on docker desktop (Mac/Windows)
    if (os.platform() === "darwin" || os.platform() === "win32") {
      return "host.docker.internal";
    }

    // For Linux
    const result = execSync("ip route | grep default | awk '{print $3}'")
      .toString()
      .trim();
    return result;
  } catch (error) {
    console.error("Error fetching host IP address:", error);
    return ""; // fallback to an empty string or handle the error appropriately
  }
};

export const getAPIUrl = () => {
  const nodeENV = process.env.NODE_ENV;
  let API_URL = "";

  if (nodeENV === "development" || !nodeENV) {
    API_URL = "localhost";
  } else if (nodeENV === "production") {
    API_URL = getHostIpAddress();
  }

  return API_URL;
};

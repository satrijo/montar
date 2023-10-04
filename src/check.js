import fs from "fs";
import axios from "axios";
import env from "dotenv";
env.config();

const checkData = () => {
  const stasiun = JSON.parse(fs.readFileSync("./src/stasiun.json", "utf8"));
  return stasiun;
};

const checkApi = async (jam) => {
  const token = process.env.TOKEN_METAR;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(
      `https://web-aviation.bmkg.go.id/api/v1/metar?stasiun=id&jam=${jam}`,
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error so it can be handled by the caller if needed.
  }
};

export { checkData, checkApi };

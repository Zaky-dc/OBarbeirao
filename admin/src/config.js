const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:3000/api"
    : "https://o-barbeirao-back.vercel.app/api";

export default API_BASE_URL;

import axios from "axios";

export async function checkFileExists(url: string, status: any) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      status(true);
    } else {
      status(false);
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      status(false);
    } else {
      status(false);
    }
  }
}

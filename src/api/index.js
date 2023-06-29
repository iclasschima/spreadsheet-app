// Assuming you have imported the necessary dependencies and set up the appropriate configurations for your API requests

const API_BASE_URL = "http://localhost:8082"; // Replace with the actual API base URL

export const saveSpreadsheet = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    // if (!response.ok) {
    //   throw new Error("Error saving spreadsheet");
    // }

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    throw new Error("Error saving spreadsheet");
  }
};

export const getProcessingStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-status?id=${id}`);

    if (!response.ok) {
      throw new Error("Error getting processing status");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error getting processing status");
  }
};

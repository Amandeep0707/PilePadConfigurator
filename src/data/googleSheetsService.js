export async function fetchSheetData() {
  try {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    const infoUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;

    const infoResponse = await fetch(infoUrl);

    if (!infoResponse.ok) {
      const errorText = await infoResponse.text();
      console.error("Sheet info error:", infoResponse.status, errorText);

      if (infoResponse.status === 403) {
        throw new Error(
          "403 Forbidden: Check if the Google Sheets API is enabled and the sheet is publicly accessible"
        );
      }
      if (infoResponse.status === 404) {
        throw new Error("404 Not Found: Check if the sheet ID is correct");
      }
      throw new Error(`HTTP error! status: ${infoResponse.status}`);
    }

    const sheetInfo = await infoResponse.json();

    // Get the actual sheet names
    const actualSheetNames = sheetInfo.sheets?.map(
      (sheet) => sheet.properties.title
    );

    // Use the first sheet's actual name
    const firstSheetName = actualSheetNames?.[0] || "Sheet1";

    // Now try to get the data
    const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${firstSheetName}?key=${apiKey}`;

    const dataResponse = await fetch(dataUrl);

    if (!dataResponse.ok) {
      const errorText = await dataResponse.text();
      console.error("Data fetch error:", dataResponse.status, errorText);
      throw new Error(`HTTP error! status: ${dataResponse.status}`);
    }

    const result = await dataResponse.json();
    const rows = result.values;

    if (!rows || rows.length === 0) {
      console.log("No data found in the sheet");
      return [];
    }

    // console.log("Raw data:", rows);

    // Convert to array of objects using first row as headers
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    // console.log("Processed data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching from Google Sheets API", err);
    throw new Error(`Failed to load product data: ${err.message}`);
  }
}

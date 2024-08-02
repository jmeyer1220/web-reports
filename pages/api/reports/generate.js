import supabase from "../../../supabase";
import { generateReport } from "../../../utils/reportGenerator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { url, setToastMessage} = req.body;
  if (!url) {
    res.status(400).json({ message: "URL is required" });
    return;
  }

  try {
    const reportData = await generateReport(url, setToastMessage);

    const { data, error } = await supabase
      .from("reports")
      .insert([{ url, data: reportData }])
      .select(); // Ensure data is returned by using .select()

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      res.status(200).json({ reportId: data[0].id });
    } else {
      throw new Error("No data returned from insert.");
    }
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
}

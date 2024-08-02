import axios from "axios";

export async function measurePerformance(url) {
  if (!url) {
    throw new Error("URL parameter is required");
  }

  // Ensure URL is valid and includes protocol
  if (!/^https?:\/\//.test(url)) {
    url = `https://${url}`;
  }

  try {
    const apiKey = process.env.PAGESPEED_API_KEY; // Make sure to set this in your environment variables
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`;

    console.log("Starting PageSpeed Insights analysis...");
    const response = await axios.get(apiUrl);
    console.log("PageSpeed Insights analysis completed.");

    const { lighthouseResult } = response.data;

    if (!lighthouseResult || !lighthouseResult.categories) {
      throw new Error("Invalid PageSpeed Insights response");
    }

    const performance =
      lighthouseResult.categories.performance?.score * 100 || 0;
    const accessibility =
      lighthouseResult.categories.accessibility?.score * 100 || 0;

    console.log("Performance score:", performance);
    console.log("Accessibility score:", accessibility);

    return {
      performance: performance.toFixed(2),
      accessibility: accessibility.toFixed(2),
    };
  } catch (error) {
    console.error(
      "Error fetching performance stats:",
      error.message,
      error.response?.data || error.stack,
    );
    throw new Error("Error fetching performance stats");
  }
}

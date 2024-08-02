import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../supabase";

export default function Report() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching report:", error);
        } else {
          setReport(data);
        }
      };

      fetchReport();
    }
  }, [id]);

  if (!report) {
    return <div>Loading...</div>;
  }

  const { url, analyzed_at, data } = report;
  const { scrapedData, platformData, crawlData, performanceData } = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{url}</h1>
      <p className="text-gray-600 mb-8">
        Analyzed at: {new Date(analyzed_at).toLocaleString()}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Scraped Data</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(scrapedData, null, 2)}
          </pre>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Platform Data</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(platformData, null, 2)}
          </pre>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Crawl Data</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Total Links: {crawlData.pageCount}</p>
            <p>Content Types:</p>
            <ul className="list-disc list-inside">
              {Object.entries(crawlData.contentTypes).map(([type, count]) => (
                <li key={type}>
                  {type}: {count}
                </li>
              ))}
            </ul>
            <p>
              Tracking Tags Detected:{" "}
              {Object.keys(crawlData.trackingTags).length}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Data</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Performance Score: {performanceData.performance}</p>
            <p>Accessibility Score: {performanceData.accessibility}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

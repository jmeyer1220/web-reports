import { useState } from "react";
import axios from "axios";
import URLListHovercard from "../components/ui/hovercard";
import ToastNotification from "../components/ui/toastNotification";
import LoadingSkeleton from "../components/ui/skeleton";

export default function Analyze() {
  const [url, setUrl] = useState("");
  const [pageCount, setPageCount] = useState(null);
  const [cms, setCms] = useState([]);
  const [hosting, setHosting] = useState([]);
  const [otherTechnologies, setOtherTechnologies] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false); // New state variable
  const [contentTypes, setContentTypes] = useState({});
  const [contentTypeBreakdown, setContentTypeBreakdown] = useState({});
  const [trackingTags, setTrackingTags] = useState({});
  const [crawledUrls, setCrawledUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setToastOpen(true);
    setPageCount(null);
    setToastMessage("Starting website analysis...");
    setCms([]);
    setHosting([]);
    setOtherTechnologies([]);
    setContentTypes({});
    setContentTypeBreakdown({});
    setTrackingTags({});
    setCrawledUrls([]); // Reset crawled URLs
    setIsAnalyzed(false);
    

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, setToastMessage }),
      });

      const result = await response.json();

      if (response.ok) {
        setToastMessage("Analysis complete!");
      } else {
        setToastMessage("Analysis failed.");
        throw new Error(result.message || "Failed to generate report");
      }
      router.push(`/report/${result.reportId}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred. Please try again.");
    }
  };


  const ResultCard = ({ title, children }) => (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200">
      <div className="bg-slate-100 p-8 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Generate a web report:
        </h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              required
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="p-2 bg-slate-900 text-slate-50 hover:bg-white hover:text-slate-900 "
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          isAnalyzed && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700">
                Analysis Results:
              </h2>
<div class="grid grid-cols-2 gap-2">
              {pageCount !== null && (
                <ResultCard title="Page Count">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {pageCount}
                  </h3>
                <div className="mt-4">
                <URLListHovercard urls={crawledUrls} />
              </div>
                </ResultCard>
              )}

              {contentTypes && Object.keys(contentTypes).length > 0 && (
                <ResultCard title="Content Types">
                  <ul className="list-disc pl-5">
                    {Object.entries(contentTypes).map(([type, count]) => (
                      <li key={type}>
                        {type}: {count} ({contentTypeBreakdown[type] || "0%"})
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {trackingTags && Object.keys(trackingTags).length > 0 && (
                <ResultCard title="Tracking Tags">
                  <ul className="list-disc pl-5">
                    {Object.entries(trackingTags).map(([tag, id]) => (
                      <li key={tag}>
                        {tag}: {id}
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {cms.length > 0 && (
                <ResultCard title="CMS">
                  <ul className="list-disc pl-5">
                    {cms.map((tech, index) => (
                      <li key={index}>{tech.name}</li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {hosting.length > 0 && (
                <ResultCard title="Hosting">
                  <ul className="list-disc pl-5">
                    {hosting.map((tech, index) => (
                      <li key={index}>{tech.name}</li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {otherTechnologies.length > 0 && (
                <ResultCard title="Other Technologies">
                  <ul className="list-disc pl-5">
                    {otherTechnologies.map((tech, index) => (
                      <li key={index}>{tech.name}</li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              {performance !== null && (
                <ResultCard title="Performance">
                  <p>{performance * 100}%</p>
                </ResultCard>
              )}
              </div>
            </div>
          )
        )}

        {content && (
          <ResultCard title="Scraped Content">
            <pre className="p-2 bg-gray-100 rounded">
              {JSON.stringify(content, null, 2)}
            </pre>
          </ResultCard>
        )}
      </div>
      <ToastNotification
        open={toastOpen}
        setOpen={setToastOpen}
        message={toastMessage}
      />
    </div>
  );
}

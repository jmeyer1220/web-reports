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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setToastOpen(true);
    setPageCount(null);
    setCms([]);
    setHosting([]);
    setOtherTechnologies([]);
    setContentTypes({});
    setContentTypeBreakdown({});
    setTrackingTags({});
    setCrawledUrls([]); // Reset crawled URLs
    setIsAnalyzed(false);
    
    try {
      // Step 1: Start the PageSpeed Insights Task
      const startResponse = await axios.post("/api/startPageSpeedTask", { url });
  
      if (startResponse.status !== 200) {
        throw new Error("Failed to initiate PageSpeed Insights task");
      }
  
      const { taskId } = startResponse.data;
  
      // Step 2: Poll for Task Completion
      const pollTaskStatus = async (taskId) => {
        const response = await axios.get("/api/checkTaskStatus", {
          params: { taskId },
        });
  
        const { task } = response.data;
        return task;
      };
  
      let task = null;
      const interval = setInterval(async () => {
        task = await pollTaskStatus(taskId);
  
        if (task.status === "completed") {
          clearInterval(interval);
  
          // Step 3: Generate the Report
          const generateResponse = await fetch("/api/reports/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url, taskId }),
          });
  
          const result = await generateResponse.json();
  
          if (!generateResponse.ok) {
            throw new Error(result.message || "Failed to generate report");
          }
  
          setIsLoading(false);
          router.push(`/report/${result.reportId}`);
        }
      }, 5000); // Check every 5 seconds
  
      // Set a timeout to handle cases where the task takes too long
      setTimeout(() => {
        if (task && task.status !== "completed") {
          clearInterval(interval);
          setIsLoading(false);
          setError("The task is taking longer than expected. Please try again later.");
        }
      }, 60000); // Timeout after 60 seconds
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const ResultCard = ({ title, children }) => (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  );

  const PageSpeedChecker = () => {
    const [url, setUrl] = useState('');
    const [taskId, setTaskId] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [result, setResult] = useState(null);
  
    const startTask = async () => {
      const response = await axios.post('/api/startPageSpeedTask', { url });
      setTaskId(response.data.taskId);
      setTaskStatus('pending');
      checkTaskStatus(response.data.taskId);
    };
  
    const checkTaskStatus = async (taskId) => {
      const interval = setInterval(async () => {
        const response = await axios.get('/api/checkTaskStatus', {
          params: { taskId },
        });
        const task = response.data.task;
        setTaskStatus(task.status);
  
        if (task.status === 'completed') {
          setResult(task.result);
          clearInterval(interval);
        }
      }, 5000); // Check every 5 seconds
    };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200">
      <div className="bg-slate-100 p-8 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Analyze a website:
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
        message="Website analysis in progress..."
      />
    </div>
  );
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSkeleton from "../../components/ui/skeleton";

const BentoBox = ({ title, children }) => (
  <div className="bg-white shadow-lg rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

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
    return <div><LoadingSkeleton /></div>;
  }

  const { url, analyzed_at, data } = report;
  const { platformData, crawlData, performanceData, churchSpecificResults } = data;
  const contentTypeData = Object.entries(crawlData.contentTypes).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{url}</h1>
      <p className="text-gray-600 mb-8">
        Analyzed at: {new Date(analyzed_at).toLocaleString()}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BentoBox title="Platform Data">
          <div className="space-y-2">
            <h3 className="font-semibold">CMS:</h3>
            <ul className="list-disc list-inside">
              {platformData.cms.map((tech) => (
                <li key={tech.name}>{tech.name}</li>
              ))}
            </ul>
            <h3 className="font-semibold">Hosting:</h3>
            <ul className="list-disc list-inside">
              {platformData.hosting.map((tech) => (
                <li key={tech.name}>{tech.name}</li>
              ))}
            </ul>
            <h3 className="font-semibold">Other Technologies:</h3>
            <ul className="list-disc list-inside">
              {platformData.otherTechnologies.map((tech) => (
                <li key={tech.name}>{tech.name}</li>
              ))}
            </ul>
          </div>
        </BentoBox>
        <BentoBox title="Crawl Data">
          <div className="space-y-2">
            <p>Total Links: {crawlData.pageCount}</p>
            <p>Tracking Tags Detected: {Object.keys(crawlData.trackingTags).length}</p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BentoBox>
        <BentoBox title="Performance Data">
          <div className="space-y-2">
            <p>Performance Score: {performanceData.performance}</p>
            <p>Accessibility Score: {performanceData.accessibility}</p>
          </div>
        </BentoBox>
        <BentoBox title="Church Specific Data">
          <div className="space-y-2">
            <p>Online Giving: {churchSpecificResults.onlineGiving ? 'Enabled' : 'Not Found'}</p>
            <p>Event Calendar: {churchSpecificResults.eventCalendar ? 'Detected' : 'Not Found'}</p>
            <p>Sermon Content: {churchSpecificResults.sermonContent ? 'Analyzed' : 'Not Found'}</p>
            <p>Social Media: {churchSpecificResults.socialMedia ? 'Analyzed' : 'Not Found'}</p>
          </div>
        </BentoBox>
      </div>
    </div>
  );
}

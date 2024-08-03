import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../supabase";
import {  PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import LoadingSkeleton from "../../components/ui/skeleton";
import { Check, X, Calendar, Video, DollarSign, Share2 } from 'lucide-react';

const BentoBox = ({ title, children, className }) => (
  <div className={className} >
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

const StatusIcon = ({ status }) => (
  status ? (
    <Check className="w-6 h-6 text-green-500" />
  ) : (
    <X className="w-6 h-6 text-red-500" />
  )
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen container mx-auto my-auto p-4 bg-slate-200">
      <h1 className="text-3xl font-bold mb-4">{url}</h1>
      <p className="text-gray-600 mb-8">
        Analyzed at: {new Date(analyzed_at).toLocaleString()}
      </p>
      <div className="grid grid-cols-12 gap-4">
        <BentoBox title="Performance Data" className="bg-white shadow-lg rounded-lg p-4 md:col-span-6 lg:col-span-4 row-start-2">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{performanceData.performance}</div>
              <div className="text-sm text-gray-500">Performance Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">{performanceData.accessibility}</div>
              <div className="text-sm text-gray-500">Accessibility Score</div>
            </div>
          </div>
        </BentoBox>

        <BentoBox title="Platform Data" className="bg-white shadow-lg rounded-lg p-4 md:col-span-6 lg:col-span-4">
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

        <BentoBox title="Crawl Data" className="bg-white shadow-lg rounded-lg p-4 md:col-span-12 lg:col-span-8 row-span-2">
          <p>Total Links: {crawlData.pageCount}</p>
          <p>Tracking Tags Detected: {Object.keys(crawlData.trackingTags).length}</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </BentoBox>

        <BentoBox title="Online Giving" className="bg-white shadow-lg rounded-lg p-4 col-span-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-500 mr-2" />
              <span className="font-semibold">Online Giving</span>
            </div>
            <StatusIcon status={churchSpecificResults.onlineGiving} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {churchSpecificResults.onlineGiving ? 'Enabled' : 'Not Found'}
          </p>
        </BentoBox>

        <BentoBox title="Event Calendar" className="bg-white shadow-lg rounded-lg p-4 col-span-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500 mr-2" />
              <span className="font-semibold">Event Calendar</span>
            </div>
            <StatusIcon status={churchSpecificResults.eventCalendar} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {churchSpecificResults.eventCalendar ? 'Detected' : 'Not Found'}
          </p>
        </BentoBox>

        <BentoBox title="Livestreaming" className="bg-white shadow-lg rounded-lg p-4 col-span-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Video className="w-8 h-8 text-blue-500 mr-2" />
              <span className="font-semibold">Livestreaming</span>
            </div>
            <StatusIcon status={churchSpecificResults.sermonContent} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {churchSpecificResults.sermonContent ? 'Analyzed' : 'Not Found'}
          </p>
        </BentoBox>

        <BentoBox title="Social Media Presence" className="bg-white shadow-lg rounded-lg p-4 col-span-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Share2 className="w-8 h-8 text-blue-500 mr-2" />
              <span className="font-semibold">Social Media</span>
            </div>
            <StatusIcon status={churchSpecificResults.socialMedia} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {churchSpecificResults.socialMedia ? 'Analyzed' : 'Not Found'}
          </p>
        </BentoBox>
      </div>
    </div>
  );
}

//import { scrapeWebsite } from './scrape';
import { analyzePlatform } from './platform';
import { crawlWebsite } from './crawl';
import { measurePerformance } from './performance';
import performChurchSpecificAnalysis from './churchAnalysis';

export async function generateReport(url) {
  //const scrapedData = await scrapeWebsite(url);
  setToastMessage("Measuring website performance...");
  const performanceData = await measurePerformance(url);
  setToastMessage("Analyzing website platform...");
  const platformData = await analyzePlatform(url);
  setToastMessage("Crawling website...");
  const crawlData = await crawlWebsite(url);
  setToastMessage("Performing website analysis...");
  const churchSpecificResults = await performChurchSpecificAnalysis(url);


  return {
    url,
    //scrapedData,
    crawlData,
    platformData,
    performanceData,
    churchSpecificResults,
    generatedAt: new Date().toISOString(),
  };
}

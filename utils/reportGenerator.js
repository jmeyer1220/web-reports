//import { scrapeWebsite } from './scrape';
import { analyzePlatform } from './platform';
import { crawlWebsite } from './crawl';
import { measurePerformance } from './performance';
import performChurchSpecificAnalysis from './churchAnalysis';

export async function generateReport(url) {
  //const scrapedData = await scrapeWebsite(url);
  const platformData = await analyzePlatform(url);
  const crawlData = await crawlWebsite(url);
  const performanceData = await measurePerformance(url);
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

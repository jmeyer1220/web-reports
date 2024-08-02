//import { scrapeWebsite } from './scrape';
import { analyzePlatform } from './platform';
import { crawlWebsite } from './crawl';
import { measurePerformance } from './performance';

export async function generateReport(url) {
  //const scrapedData = await scrapeWebsite(url);
  const platformData = await analyzePlatform(url);
  const crawlData = await crawlWebsite(url);
  const performanceData = await measurePerformance(url);

  return {
    url,
    //scrapedData,
    platformData,
    crawlData,
    performanceData,
    generatedAt: new Date().toISOString(),
  };
}

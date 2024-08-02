import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

export async function measurePerformance(targetUrl) {
  if (!targetUrl) {
    throw new Error('URL parameter is required');
  }

  // Remove the protocol (http:// or https://) if present
  targetUrl = targetUrl.replace(/^https?:\/\//, '');

  // Ensure URL is valid
  if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(targetUrl)) {
    throw new Error('Invalid URL format');
  }

  try {
    const port = 9222; // Specify a fixed port

    console.log('Launching Chrome with --no-sandbox...');
    const chrome = await launch({
      chromeFlags: ['--headless', '--no-sandbox'],
      logLevel: 'info',
      chromePath: process.env.CHROME_PATH, // Ensure we use the correct Chrome path
      port,
      maxConnectionRetries: 60,
    });

    console.log(`Chrome debugging port: ${port}`);
    console.log('Checking Chrome connection...');

    // Ensure the Chrome connection is working before starting the audit
    const response = await fetch(`http://localhost:${port}/json/version`);
    const json = await response.json();
    console.log('Chrome connection check:', json);

    const options = {
      logLevel: 'info',
      output: 'json',
      port,
      onlyCategories: ['performance'],
      emulatedFormFactor: 'desktop',
      timeout: 180000, // 3 minutes timeout
    };

    console.log('Starting Lighthouse audit...');
    const runnerResult = await lighthouse(`https://${targetUrl}`, options);

    console.log('Lighthouse audit completed.');

    // Log the Lighthouse response to inspect
    console.log('Lighthouse runner result:', runnerResult);

    const performance = runnerResult.lhr.categories.performance.score * 100;
    console.log('Lighthouse performance score:', performance);

    await chrome.kill();
    return { performance };
  } catch (error) {
    console.error('Error fetching performance stats:', error.message, error.response?.data || error.stack);

    // Ensure Chrome process is killed in case of an error
    try {
      await chrome.kill();
    } catch (killError) {
      console.error('Error killing Chrome:', killError.message);
    }

    throw new Error('Error fetching performance stats');
  }
}

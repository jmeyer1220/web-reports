import cheerio from 'cheerio';
import axios from 'axios';

async function analyzeOnlineGiving(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const commonKeywords = ['donate', 'give', 'contribution', 'offering', 'tithe'];
    const platforms = {
      'Tithe.ly': /tithe\.ly/i,
      'Pushpay': /pushpay\.com/i,
      'Planning Center': /planning\.center/i,
      'Subsplash': /subsplash\.com/i,
    };

    let hasOnlineGiving = false;
    let platform = 'Custom or Unknown';
    let donationOptions = [];

    // Check for common keywords in links and buttons
    $('a, button').each((_, elem) => {
      const text = $(elem).text().toLowerCase();
      if (commonKeywords.some(keyword => text.includes(keyword))) {
        hasOnlineGiving = true;
        donationOptions.push(text.trim());
      }
    });

    // Check for known giving platforms
    Object.entries(platforms).forEach(([name, regex]) => {
      if (regex.test(data)) {
        platform = name;
        hasOnlineGiving = true;
      }
    });

    return { hasOnlineGiving, platform, donationOptions };
  } catch (error) {
    console.error('Error analyzing online giving:', error);
    return { hasOnlineGiving: false };
  }
}

export default analyzeOnlineGiving;
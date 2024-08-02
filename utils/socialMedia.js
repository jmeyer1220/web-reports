import cheerio from 'cheerio';
import axios from 'axios';

async function analyzeSocialMedia(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const socialPlatforms = {
      'Facebook': /facebook\.com/i,
      'Instagram': /instagram\.com/i,
      'Twitter': /twitter\.com/i,
      'YouTube': /youtube\.com/i,
      'LinkedIn': /linkedin\.com/i,
      'TikTok': /tiktok\.com/i,
    };

    let detectedPlatforms = [];
    let followersCount = {};

    // Detect social media links
    $('a').each((_, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        Object.entries(socialPlatforms).forEach(([name, regex]) => {
          if (regex.test(href) && !detectedPlatforms.includes(name)) {
            detectedPlatforms.push(name);
          }
        });
      }
    });

    // Note: Accurate follower counts often require API access, which may not be freely available
    // This is a placeholder for potential future implementation

    return { platforms: detectedPlatforms, followersCount };
  } catch (error) {
    console.error('Error analyzing social media:', error);
    return { platforms: [] };
  }
}

export default analyzeSocialMedia;
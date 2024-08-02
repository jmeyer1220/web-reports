import cheerio from 'cheerio';
import axios from 'axios';

async function analyzeSermonContent(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const sermonKeywords = ['sermon', 'message', 'teaching', 'podcast'];
    const streamingKeywords = ['live', 'stream', 'watch online'];
    const platforms = {
      'YouTube': /youtube\.com/i,
      'Vimeo': /vimeo\.com/i,
      'Facebook Live': /facebook\.com.*\/live/i,
      'SermonAudio': /sermonaudio\.com/i,
      'Subsplash': /subsplash\.com/i,
    };

    let hasSermonArchive = false;
    let hasLiveStreaming = false;
    let detectedPlatforms = [];

    // Check for sermon archives
    $('a, h1, h2, h3, h4, h5, h6').each((_, elem) => {
      const text = $(elem).text().toLowerCase();
      if (sermonKeywords.some(keyword => text.includes(keyword))) {
        hasSermonArchive = true;
      }
      if (streamingKeywords.some(keyword => text.includes(keyword))) {
        hasLiveStreaming = true;
      }
    });

    // Check for known platforms
    Object.entries(platforms).forEach(([name, regex]) => {
      if (regex.test(data)) {
        detectedPlatforms.push(name);
        if (name === 'YouTube' || name === 'Facebook Live') {
          hasLiveStreaming = true;
        }
      }
    });

    return { hasSermonArchive, hasLiveStreaming, platforms: detectedPlatforms };
  } catch (error) {
    console.error('Error analyzing sermon content:', error);
    return { hasSermonArchive: false, hasLiveStreaming: false, platforms: [] };
  }
}

export default analyzeSermonContent;
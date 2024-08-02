import cheerio from 'cheerio';
import axios from 'axios';

async function detectEventCalendar(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const calendarKeywords = ['calendar', 'events', 'upcoming', 'schedule'];
    const calendarPlugins = {
      'The Events Calendar': /tribe-events/i,
      'EventON': /ajde_evcal/i,
      'All-in-One Event Calendar': /ai1ec/i,
      'Google Calendar': /google\.com\/calendar/i,
    };

    let hasEventCalendar = false;
    let calendarType = 'Custom or Unknown';

    // Check for calendar keywords
    $('a, h1, h2, h3, h4, h5, h6').each((_, elem) => {
      const text = $(elem).text().toLowerCase();
      if (calendarKeywords.some(keyword => text.includes(keyword))) {
        hasEventCalendar = true;
      }
    });

    // Check for known calendar plugins
    Object.entries(calendarPlugins).forEach(([name, regex]) => {
      if (regex.test(data)) {
        calendarType = name;
        hasEventCalendar = true;
      }
    });

    return { hasEventCalendar, calendarType };
  } catch (error) {
    console.error('Error detecting event calendar:', error);
    return { hasEventCalendar: false };
  }
}

export default detectEventCalendar;
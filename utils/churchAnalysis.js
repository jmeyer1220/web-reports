import analyzeOnlineGiving from './analyzeOnlineGiving';
import detectEventCalendar from './detectEventCalendar';
import analyzeSermonContent from './analyzeSermonContent';
import analyzeSocialMedia from './analyzeSocialMedia';

async function performChurchSpecificAnalysis(url) {
  const [onlineGiving, eventCalendar, sermonContent, socialMedia] = await Promise.all([
    analyzeOnlineGiving(url),
    detectEventCalendar(url),
    analyzeSermonContent(url),
    analyzeSocialMedia(url),
  ]);

  return {
    onlineGiving,
    eventCalendar,
    sermonContent,
    socialMedia,
  };
}

export default performChurchSpecificAnalysis;
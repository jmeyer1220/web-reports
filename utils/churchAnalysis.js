import analyzeOnlineGiving from './onlineGiving';
import detectEventCalendar from './eventCalendar';
import analyzeSermonContent from './sermonsLiveStreaming';
import analyzeSocialMedia from './socialMedia';

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
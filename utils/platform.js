import axios from 'axios';

export async function analyzePlatform(targetUrl) {
  if (!targetUrl) {
    throw new Error('URL parameter is required');
  }

  // Remove the protocol (http:// or https://) if present
  targetUrl = targetUrl.replace(/^https?:\/\//, '');

  try {
    const apiKey = process.env.WHATCMS_API_KEY; // Replace with your actual WhatCMS API key
    const response = await axios.get(
      `https://whatcms.org/API/Tech?key=${apiKey}&url=${targetUrl}`,
    );

    // Log the full response to inspect
    console.log('WhatCMS API response:', response.data);

    const results = response.data.results || [];
    let cms = [];
    let hosting = [];
    let otherTechnologies = [];

    // Categorize technologies into CMS and hosting
    results.forEach((tech) => {
      if (tech.categories.includes('CMS')) {
        cms.push(tech);
      } else if (tech.categories.includes('Hosting')) {
        hosting.push(tech);
      } else {
        otherTechnologies.push(tech);
      }
    });

    return { cms, hosting, otherTechnologies };
  } catch (error) {
    console.error('Error detecting technologies:', error.message, error.response?.data || error.stack);
    throw new Error('Error detecting technologies');
  }
}

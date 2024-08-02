// /pages/api/startPageSpeedTask.js

import { supabase } from '../../supabase/index';

export default async function handler(req, res) {
  const { url } = req.body;

  try {
    // Insert a new task into the database with a status of 'pending'
    const { data, error } = await supabase
      .from('pagespeed_tasks')
      .insert([{ url, status: 'pending' }]);

    if (error) {
      throw error;
    }

    // Return the task ID to the client
    res.status(200).json({ taskId: data[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

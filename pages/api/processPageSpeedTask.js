// /pages/api/processPageSpeedTask.js

import { supabase } from '../../lib/supabaseClient';
import axios from 'axios';

export default async function handler(req, res) {
  const { taskId } = req.query;

  try {
    // Fetch the task from the database
    const { data: task, error } = await supabase
      .from('pagespeed_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error || !task) {
      throw new Error('Task not found');
    }

    if (task.status === 'completed') {
      return res.status(200).json({ message: 'Task already completed' });
    }

    // Process the PageSpeed Insights API request
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${task.url}`
    );

    // Update the task in the database with the result
    const { error: updateError } = await supabase
      .from('pagespeed_tasks')
      .update({ status: 'completed', result: response.data })
      .eq('id', taskId);

    if (updateError) {
      throw updateError;
    }

    res.status(200).json({ message: 'Task completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

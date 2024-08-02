// /pages/api/checkTaskStatus.js

import { supabase } from '../../lib/supabaseClient';

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

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

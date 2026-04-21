const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const supabaseAdmin = require('../supabaseAdmin');

const router = express.Router();

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;

    const { data, error } = await supabaseAdmin
      .from('ocr_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('History fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }

    return res.json(data);
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;

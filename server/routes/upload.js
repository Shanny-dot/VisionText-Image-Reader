const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const authMiddleware = require('../middleware/authMiddleware');
const supabaseAdmin = require('../supabaseAdmin');

const router = express.Router();

// Multer config — memory storage, 5MB limit, image-only filter
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  },
});

router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.sub;
    const buffer = req.file.buffer;
    const originalName = req.file.originalname;

    // 1. Run Tesseract OCR on the image buffer
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');

    // 2. Upload image to Supabase Storage
    const storagePath = `${userId}/${Date.now()}-${originalName}`;
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('ocr-images')
      .upload(storagePath, buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      // Continue even if storage fails — OCR result is still valuable
    }

    // 3. Insert row into ocr_history
    const { error: dbError } = await supabaseAdmin
      .from('ocr_history')
      .insert({
        user_id: userId,
        extracted_text: text,
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      return res.status(500).json({ error: 'Failed to save OCR result' });
    }

    // 4. Return extracted text
    return res.json({ extractedText: text });
  } catch (err) {
    console.error('Upload/OCR error:', err);
    return res.status(500).json({ error: 'Failed to process image' });
  }
});

module.exports = router;

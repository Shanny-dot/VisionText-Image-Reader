require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabaseAdmin.from('ocr_history').select('id, user_id, image_url, extracted_text').limit(1);
  console.log('Select Error:', error);
}
run();

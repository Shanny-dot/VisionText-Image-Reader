<h1 align="center">VisionText — Smart OCR Platform</h1>

<p align="center">
  <strong>A full-stack, AI-powered Optical Character Recognition web application.</strong><br>
  Transform your image-based documents into textual clarity instantly using Tesseract.js and Supabase.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

---

## Interface Sneak Peek

<img width="500" height="275" alt="Screenshot 2026-04-21 at 6 28 44 PM" src="https://github.com/user-attachments/assets/b8c6ac57-c60f-4ba1-ad6e-d32237e8213c" />
<img width="500" height="275" alt="Screenshot 2026-04-21 at 6 27 27 PM" src="https://github.com/user-attachments/assets/bfd72ef6-2de3-4791-a016-9d917b7bd078" />
<img width="500" height="275" alt="Screenshot 2026-04-21 at 6 27 51 PM" src="https://github.com/user-attachments/assets/27dd387d-e1b5-43e0-9e8e-a2dbf2c3d3ae" />
<img width="500" height="275" alt="Screenshot 2026-04-21 at 6 27 39 PM" src="https://github.com/user-attachments/assets/5cb0afd0-3b32-47d2-b934-dd2a91301ae4" />
<img width="500" height="275" alt="Screenshot 2026-04-21 at 6 27 33 PM" src="https://github.com/user-attachments/assets/236acd3c-98b5-4f7a-b41b-9eafce0e471e" />


---

## 🛠 Local Setup Instructions

Want to run VisionText locally? You'll need Node.js and a Supabase Project.

### 1. Supabase Configuration
Create a Supabase project and enable **Authentication** (Email/Password) and create a **Storage Bucket** (e.g., `ocr_bucket`). Create a single table in your SQL Editor:

```sql
CREATE TABLE ocr_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 2. Backend Installation
```bash
cd server
npm install
```
Create a `server/.env` file with you credentials:
```env
PORT=5001
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_secret_role_key
```
Start the backend:
```bash
node index.js
```

### 3. Frontend Installation
```bash
cd client
npm install
```
Create a `client/.env` file:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_API_URL=http://localhost:5001
```
Start the frontend:
```bash
npm start
```

---

## ☁️ Deployment

VisionText includes automated deployment routing for effortless hosting:
- The **Frontend** can be deployed instantly to Netlify. A `netlify.toml` config handles all frontend routing.
- The **Backend** can be deployed to Render using a Web Service pointed directly at the `server/` directory.
  
---
<p align="center">
  Built with ❤️ in India by Shantanu
</p>

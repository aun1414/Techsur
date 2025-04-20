# Smart Resume Screener

A full-stack web app that helps candidates match their resumes to job descriptions using AI.  
It doesn’t just give you a number—it gives you insights: what skills you're missing, what you've nailed, and how your experience stacks up for the role.  
This project is built to feel like a real-world tool you'd actually use during a job hunt—because, well, I’ve been there.

---

## What It Does

- **Semantic Match Scoring** between resume and job description (0–100)  
- AI-generated breakdown:
  - ✅ Strengths & weaknesses  
  - 🔍 Skills matched  
  - 🧩 Relevant past experiences  
  - 🏷️ Keywords extracted from JD  
  - 💬 1-line summary of the match  
- **Match History Dashboard** with role filtering  
- Upload support for PDF/text resumes and job descriptions  
- Clean, responsive UI with dark mode  
- Fully containerized and ready for deployment  

---

## Tech Stack

| Layer       | Tech Used                             |
|-------------|----------------------------------------|
| Frontend    | React, TailwindCSS, TypeScript         |
| Backend     | Spring Boot (Java), PostgreSQL         |
| AI Service  | Flask (Python), Google Gemini API      |
| DevOps      | Docker, GitHub Actions, Swagger (OpenAPI) |
| Deployment  | AWS (ECS, RDS, ALB, etc.)              |

---

## How It Works

1. User uploads resume + job description  
2. Spring Boot backend sends them to a Flask-based AI microservice  
3. Flask service calls Google Gemini API with a custom prompt  
4. Response is parsed into:
   - Strengths/weaknesses  
   - Matching skills  
   - Keywords  
   - Score + explanation  
5. Results are stored and shown in the dashboard  

---

## Screenshots

### Homescreen
![ss1](https://github.com/user-attachments/assets/0dc1cec9-69f6-45cd-93ac-d2d03ca8a1d5)

### Admin dashboard
![ss7](https://github.com/user-attachments/assets/df90933d-2bfe-42f2-8e26-445105810a79)

### Upload Page
![ss8](https://github.com/user-attachments/assets/e81e684c-9e81-426c-92e8-5d10fcbe6998)

### Login Page
![ss2](https://github.com/user-attachments/assets/6c244a0f-39bf-4470-a466-b117662cbe98)

### Match History Page
![ss4](https://github.com/user-attachments/assets/382e90e5-3718-4b1d-97f1-a972e2ef3c7f)

### Match insights

![ss5](https://github.com/user-attachments/assets/748d1b7a-f7e5-4a94-97c5-9a3b0e566f8e)

![ss6](https://github.com/user-attachments/assets/cde2023c-6e3e-4ccc-962d-f4ea954f690f)

### Swagger

![Capture](https://github.com/user-attachments/assets/9b6ea509-4286-465f-abdb-de8bf5688225)

---

## Deployment

- CI/CD is set up via GitHub Actions  
- Docker containers are used for both backend and microservice  
- Easily deployable on AWS with ECS + RDS  
- Swagger UI is included for testing backend endpoints  


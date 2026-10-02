from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import anthropic 
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Portfolio Contact + Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ratnesh-portfolio.vercel.app",
        "http://localhost",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"]
)

SYSTEM_PROMPT = """
You are Ratnesh Makwana's personal portfolio assistant. 
Your job is to answer questions ONLY about Ratnesh's:
- Skills and technologies
- Projects
- Work experience
- Education
- Background and goals

If someone asks anything OUTSIDE of Ratnesh's portfolio/resume 
(like general coding help, news, jokes, other topics), 
politely say: "I can only answer questions about Ratnesh's 
portfolio and experience. Please ask me about his projects, 
skills, or background!"

Here is Ratnesh's complete profile:

NAME: Ratnesh Makwana
LOCATION: Indore, Madhya Pradesh, India
ROLE: Python Backend Developer

SUMMARY:
Python Backend Developer with expertise in building 
production-grade REST APIs and microservices using FastAPI 
and Flask. Proficient in MySQL, MongoDB, Redis, Docker, 
AWS (EC2, S3), and GitHub Actions CI/CD. Built and deployed 
6 end-to-end backend projects with real-world architecture patterns.

SKILLS:
- Languages: Python, SQL, Bash
- Frameworks: FastAPI, Flask, SQLAlchemy, Pydantic
- Databases: MySQL, MongoDB, Redis
- Cloud/DevOps: AWS EC2, AWS S3, Docker, docker-compose, 
  GitHub Actions, CI/CD, Render
- Concepts: REST API, Microservices, JWT Auth, RBAC, 
  Rate Limiting, Caching, Pytest

PROJECTS:

1. MiniStream — Content Streaming Platform
   Tech: FastAPI, Flask, MySQL, MongoDB, Redis, AWS S3, Docker, EC2
   - Microservices architecture (FastAPI main API + Flask notification)
   - Redis Sorted Set for trending, HyperLogLog for unique views
   - 5 Docker containers on AWS EC2 with CI/CD auto-deploy

2. AI Resume Screener
   Tech: FastAPI, OpenAI GPT-3.5, MySQL, MongoDB, Redis, AWS S3
   - OpenAI GPT-3.5 integration for intelligent resume scoring
   - Redis caching reduced AI API calls by 60%+
   - Background tasks for async processing

3. Flask Advanced CMS
   Tech: Flask, MySQL, MongoDB, Redis, AWS S3, Docker
   - RBAC (Admin/Author/Reader) with custom decorators
   - MySQL FULLTEXT search + Redis caching
   - AWS S3 presigned URLs

4. E-Commerce Cart System
   Tech: FastAPI, MySQL, MongoDB, Docker
   - Dual database (MySQL + MongoDB)
   - Background tasks for notifications

5. FastAPI Notes App
   Tech: FastAPI, MySQL, JWT, Docker, Render
   - Pydantic validation, Dependency Injection, OAuth2 JWT

6. Task Manager API
   Tech: Flask, MySQL, JWT, Docker, GitHub Actions, Pytest
   - App Factory + Blueprints pattern
   - Pytest test suite, CI/CD pipeline

EDUCATION:
B.Tech — Computer Science Engineering

CONTACT:
Email: ratnesh@example.com
GitHub: github.com/ratneshbuilds03
LinkedIn: linkedin.com/in/ratnesh

Keep answers short, friendly, and professional.
Always respond in the same language the user writes in 
(Hindi or English).
"""

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str = "Portfolio Contact"
    message: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/contact")
async def contact(form: ContactForm):
    print(f"New message from {form.name} ({form.email})")
    return {"message": "Message received successfully"}

class ChatMessage(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatMessage):
    try:
        client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": data.message}
            ]
        )

        return {
            "reply": response.content[0].text
        }

    except Exception as e:
        return {
            "reply": "Sorry, I'm having trouble responding right now. Please try again or contact Ratnesh directly at ratnesh@example.com"
        }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__) 

app = FastAPI(title="Portfolio Contact API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://portfolio-liart-psi-otyvjsiclc.vercel.app/",
        "http://localhost",
        "http://127.0.0.1:5500"
        ],
    allow_methods=["POST","GET"],
    allow_headers=["*"]
)

class ContantForm(BaseModel):
    name: str
    email:EmailStr
    subject:str="Portfolio Contact"
    message:str

@app.get("/health")
def health():
    return{"status":"ok"}

@app.post("/contact")
async def contact(form:ContantForm):
    logger.info(f"New Message from {form.name} ({form.email})")
    logger.info(f" Subject: {form.subject}")
    logger.info(f"Message: {form.message[:100]}...")
    return {"message": "Message received successfully"}

    
    
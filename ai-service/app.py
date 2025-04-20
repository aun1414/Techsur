from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz 
import docx  
import os
from openai import OpenAI

import google.generativeai as genai



from sentence_transformers import SentenceTransformer, util
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

from dotenv import load_dotenv
load_dotenv()  # Loads the .env file into environment variables

app = Flask(__name__)
CORS(app)  

# Load Gemini API key from environment
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")  # or "gemini-pro", etc.

def extract_text(file_storage):
    filename = file_storage.filename.lower()

    # Save file temporarily to read it
    temp_path = "temp_" + filename
    file_storage.save(temp_path)

    if filename.endswith(".pdf"):
        return extract_pdf_text(temp_path)
    elif filename.endswith(".docx"):
        return extract_docx_text(temp_path)
    elif filename.endswith(".txt"):
        with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    else:
        return file_storage.read().decode('utf-8', errors='ignore')
    os.remove(temp_path)

def extract_pdf_text(path):
    text = ""
    doc = fitz.open(path)
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

def extract_docx_text(path):
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def analyze_with_gemini(resume_text, job_text):
    prompt = f"""
You are an expert resume evaluator. Given the resume and job description below, do the following in this exact format:

**1. Candidate Fit Summary:**
Provide a short summary analyzing the candidate's fit for the job. Include:
**Strengths:** ...
**Weaknesses:** ...

**2. Key Matching Skills:**
List 5–10 bullet points of key skills found in the resume that match the job.

**3. Relevant Past Experiences/Accomplishments:**
List bullet points highlighting past experience and notable achievements.

**4. Keywords from Job Description:**
List the most important keywords extracted from the job description.

**5. Match Score Explanation:**
Write a single sentence explaining the candidate's match score.

Resume:
{resume_text}

Job Description:
{job_text}
    """

    response = model.generate_content(prompt)
    return response.text


@app.route('/match', methods=['POST'])
def match():
    try:
        #Read uploaded files
        resume_file = request.files['resume']
        job_file = request.files['job']

        resume_text = extract_text(resume_file)
        job_text = extract_text(job_file)


        embeddings = bert_model.encode([resume_text, job_text], convert_to_tensor=True)
        similarity_score = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item() * 100
        analysis = analyze_with_gemini(resume_text, job_text)
        return jsonify({
            "match": round(similarity_score, 2),
            "resume_preview": resume_text[:100],
            "job_preview": job_text[:100],
            "analysis": analysis
        })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

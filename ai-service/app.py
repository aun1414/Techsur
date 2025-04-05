from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz 
import docx  
import os
import openai

from sentence_transformers import SentenceTransformer, util
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

from dotenv import load_dotenv
load_dotenv()  # Loads the .env file into environment variables
#client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)  

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

# def generate_fit_summary(resume_text, job_text):
#     prompt = f"""Given the following resume and job description, explain why this candidate is a good fit for the job in 2-3 sentences.

# Resume:
# {resume_text[:1500]}

# Job Description:
# {job_text[:1500]}

# Fit Explanation:"""

#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=[{"role": "user", "content": prompt}],
#         max_tokens=150,
#         temperature=0.7
#     )

#     return response['choices'][0]['message']['content'].strip()


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

        #fit_summary = generate_fit_summary(resume_text, job_text)
        return jsonify({
            "match": round(similarity_score, 2),
            ##summary": fit_summary,
            "resume_preview": resume_text[:100],
            "job_preview": job_text[:100]
        })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(port=5000)

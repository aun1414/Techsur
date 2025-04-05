from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz 
import docx  
import os
from sentence_transformers import SentenceTransformer, util
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

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
    else:
        return file_storage.read().decode('utf-8', errors='ignore')

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

        return jsonify({
            "match": round(similarity_score, 2),
            "resume_preview": resume_text[:100],
            "job_preview": job_text[:100]
        })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(port=5000)

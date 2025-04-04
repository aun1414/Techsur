from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz  # for PDF
import docx  # for DOCX
import os

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


        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] * 100

        return jsonify({
            "match": round(similarity_score, 2),
            "resume_preview": resume_text[:100],
            "job_preview": job_text[:100]
        })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(port=5000)

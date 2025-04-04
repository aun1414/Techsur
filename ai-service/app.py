from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = Flask(__name__)
CORS(app)  

@app.route('/match', methods=['POST'])
def match():
    try:
        #Read uploaded files
        resume_file = request.files['resume']
        job_file = request.files['job']

        resume_text = resume_file.read().decode('utf-8')
        job_text = job_file.read().decode('utf-8')

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

from flask import Flask, request, jsonify
from flask_cors import CORS

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

        #Simulated AI logic (mocked for now)
        # Later, you can replace this with OpenAI, HuggingFace, or custom model
        mock_score = 92.4

        return jsonify({
            "match": mock_score,
            "resume_preview": resume_text[:100],
            "job_preview": job_text[:100]
        })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(port=5000)

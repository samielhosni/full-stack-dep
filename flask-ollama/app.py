from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route('/query', methods=['POST'])
def query_ollama():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        response = requests.post(
            "http://ollama:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            }
        )

        if response.status_code != 200:
            return jsonify({"error": "Ollama API error", "details": response.text}), 500

        data = response.json()
        print("Ollama Raw Response:", data)

        raw_response = data.get("response", "")

        # Try to parse the stringified JSON inside `response`
        try:
            parsed = json.loads(raw_response)
            if isinstance(parsed, dict):
                # Extract first value (like "Hello!" from {"greeting": "Hello!"})
                clean_msg = list(parsed.values())[0]
            else:
                clean_msg = parsed
        except Exception:
            clean_msg = raw_response  # fallback if not JSON

        return jsonify({"response": clean_msg})

    except Exception as e:
        return jsonify({"error": "Request failed", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
import os
import time
import webbrowser
import logging
from flask import Flask, send_file, request, jsonify, send_from_directory
from flask_cors import CORS
from io import StringIO
import sys
from contextlib import redirect_stdout, redirect_stderr

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Set root directory to the script's location
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(ROOT_DIR, 'static')
GENERATED_CODES_DIR = os.path.join(ROOT_DIR, 'GeneratedCodes')

# Initialize Flask app
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='/static')
CORS(app)

# Create GeneratedCodes directory if it doesn't exist
if not os.path.exists(GENERATED_CODES_DIR):
    os.makedirs(GENERATED_CODES_DIR)

@app.route('/')
def serve_index():
    logging.debug('Serving MedusaCB.html')
    return send_file(os.path.join(ROOT_DIR, 'MedusaCB.html'))

@app.route('/favicon.ico')
def serve_favicon():
    logging.debug('Serving favicon.ico')
    return '', 204

@app.route('/convert', methods=['POST'])
def convert_code():
    logging.debug('Received convert request: %s', request.json)
    try:
        code = request.json.get('code', '')
        if not code:
            logging.error('No code provided in convert request')
            return jsonify({'error': 'No code provided'}), 400
        
        stdout = StringIO()
        stderr = StringIO()
        with redirect_stdout(stdout), redirect_stderr(stderr):
            exec(code, {})
        
        error_output = stderr.getvalue()
        if error_output:
            logging.error('Code execution error: %s', error_output)
            return jsonify({'error': error_output}), 400
        
        logging.debug('Code converted successfully')
        return jsonify({'message': 'Code successfully converted and tested for compilation/runtime errors'})
    
    except Exception as e:
        logging.error('Convert error: %s', str(e))
        return jsonify({'error': str(e)}), 400

@app.route('/download', methods=['POST'])
def download_code():
    logging.debug('Received download request: %s', request.json)
    try:
        code = request.json.get('code', '')
        if not code:
            logging.error('No code provided in download request')
            return jsonify({'error': 'No code to download'}), 400
        
        timestamp = time.strftime('%Y%m%d_%H%M%S')
        filename = f'generated_code_{timestamp}.py'
        filepath = os.path.join(GENERATED_CODES_DIR, filename)
        
        with open(filepath, 'w') as f:
            f.write(code)
        
        logging.debug('File saved: %s', filepath)
        return send_file(filepath, as_attachment=True, download_name=filename)
    
    except Exception as e:
        logging.error('Download error: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    logging.debug('Test endpoint called')
    return jsonify({'message': 'Backend is reachable'})

if __name__ == '__main__':
    logging.info('Starting Flask server on port 5672')
    webbrowser.open('http://localhost:5672')
    app.run(host='0.0.0.0', port=5672, debug=False)
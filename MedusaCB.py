import os
import time
import webbrowser
import traceback
import subprocess
from flask import Flask, send_file, request, jsonify, url_for
from flask_cors import CORS
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr
import logging
import ast

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set root directory to the script's location
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(ROOT_DIR, 'static')
GENERATED_CODES_DIR = os.path.join(ROOT_DIR, 'GeneratedCodes')

# Initialize Flask app
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='/static')
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST"], "allow_headers": ["Content-Type"]}})

# Create or validate GeneratedCodes directory
if not os.path.exists(GENERATED_CODES_DIR):
    try:
        os.makedirs(GENERATED_CODES_DIR)
    except Exception as e:
        logging.error('Failed to create GeneratedCodes directory: %s', str(e))
        raise
if not os.access(GENERATED_CODES_DIR, os.W_OK):
    logging.error('GeneratedCodes directory is not writable')
    raise PermissionError('GeneratedCodes directory is not writable')

def preprocess_code(code):
    """Preprocess code to handle type conversions explicitly and ensure compatibility."""
    try:
        tree = ast.parse(code)
        modified = False
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and hasattr(node.func, 'id'):
                if node.func.id in ['str', 'float', 'bool']:
                    if node.args and isinstance(node.args[0], ast.Num):
                        continue  # Numeric literals are fine
                    elif node.args and isinstance(node.args[0], ast.Name):
                        var_name = node.args[0].id
                        # Check if the variable is part of a math operation
                        parent = next((n for n in ast.walk(tree) if isinstance(n, ast.BinOp) and (n.left.id == var_name if hasattr(n.left, 'id') else False) or (n.right.id == var_name if hasattr(n.right, 'id') else False)), None)
                        if parent and node.func.id == 'str':
                            # If used in a math operation, ensure conversion happens after
                            code_lines = code.split('\n')
                            for i, line in enumerate(code_lines):
                                if f"{node.func.id}({var_name})" in line:
                                    code_lines[i] = line.replace(f"{node.func.id}({var_name})", var_name)
                                    # Insert conversion after the operation
                                    insert_point = i + 1
                                    code_lines.insert(insert_point, f"{var_name} = {node.func.id}({var_name})")
                                    modified = True
                                    break
        return '\n'.join(code_lines) if modified else code
    except SyntaxError as se:
        logging.error('Syntax error during preprocessing: %s', str(se))
        return code
    except Exception as e:
        logging.error('Preprocessing exception: %s', str(e))
        return code

@app.route('/')
def serve_index():
    try:
        return send_file(os.path.join(ROOT_DIR, 'MedusaCB.html'))
    except Exception as e:
        return jsonify({'error': 'Failed to serve index'}), 500

@app.route('/favicon.ico')
def serve_favicon():
    return '', 204

@app.route('/convert', methods=['POST'])
def convert_code():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        code = data.get('code', '')
        if not code:
            return jsonify({'error': 'No code provided'}), 400
        
        # Preprocess the code to handle conversions
        cleaned_code = '\n'.join(line.strip() for line in code.split('\n') if line.strip())
        preprocessed_code = preprocess_code(cleaned_code)
        
        stdout = StringIO()
        stderr = StringIO()
        local_env = {}
        try:
            with redirect_stdout(stdout), redirect_stderr(stderr):
                exec(preprocessed_code, {}, local_env)
        except Exception as exec_error:
            error_msg = ''.join(traceback.format_exception(type(exec_error), exec_error, exec_error.__traceback__))
            if "unsupported operand type" in error_msg or "invalid literal" in error_msg:
                return jsonify({'error': 'Type conversion error: Ensure numeric values for math operations before string conversion'}), 400
            logging.error('Conversion error: %s', error_msg)
            return jsonify({'error': f'Code execution failed: {error_msg}'}), 400
        
        error_output = stderr.getvalue()
        if error_output:
            logging.error('Conversion stderr: %s', error_output)
            return jsonify({'error': f'Code execution error: {error_output}'}), 400
        
        stdout_output = stdout.getvalue()
        return jsonify({
            'message': 'Code successfully converted and tested',
            'output': stdout_output
        })
    
    except ValueError as ve:
        return jsonify({'error': 'Invalid JSON format'}), 400
    except Exception as e:
        logging.error('Conversion exception: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['POST'])
def download_code():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        code = data.get('code', '')
        if not code:
            return jsonify({'error': 'No code to download'}), 400
        
        timestamp = time.strftime('%Y%m%d_%H%M%S')
        filename = f'generated_code_{timestamp}.py'
        filepath = os.path.join(GENERATED_CODES_DIR, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(code)
        except Exception as e:
            logging.error('Failed to save file: %s', str(e))
            return jsonify({'error': f'Failed to save file: {str(e)}'}), 500
        
        download_url = url_for('serve_download_file', filename=filename)
        return jsonify({
            'message': 'File prepared for download',
            'filename': filename,
            'download_url': download_url,
            'error': None
        })
    
    except ValueError as ve:
        return jsonify({'error': 'Invalid JSON format'}), 400
    except Exception as e:
        logging.error('Download exception: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/download/file/<path:filename>')
def serve_download_file(filename):
    try:
        filepath = os.path.join(GENERATED_CODES_DIR, filename)
        if not os.path.exists(filepath):
            logging.error('File not found: %s', filepath)
            return jsonify({'error': 'File not found'}), 404
        return send_file(filepath, as_attachment=True, download_name=filename)
    except Exception as e:
        logging.error('Failed to serve file: %s', str(e))
        return jsonify({'error': f'Failed to serve file: {str(e)}'}), 500

@app.route('/install', methods=['POST'])
def install_package():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.get_json()
        command = data.get('command', '')
        if not command or not command.startswith('pip install '):
            return jsonify({'error': 'Invalid pip command'}), 400
        
        package = command.replace('pip install ', '').strip()
        logging.info('Executing pip install for package: %s', package)
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode != 0:
                logging.error('Pip install failed: %s', result.stderr)
                return jsonify({'error': f'Pip install failed: {result.stderr}'}), 500
            logging.info('Pip install succeeded: %s', result.stdout)
            return jsonify({
                'message': f'Successfully installed {package}',
                'error': None
            })
        except Exception as e:
            logging.error('Pip install exception: %s', str(e))
            return jsonify({'error': f'Failed to install package: {str(e)}'}), 500
    except ValueError as ve:
        return jsonify({'error': 'Invalid JSON format'}), 400
    except Exception as e:
        logging.error('Install exception: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'Backend is reachable'})

if __name__ == '__main__':
    webbrowser.open('http://localhost:5672')
    app.run(host='0.0.0.0', port=5672, debug=False)
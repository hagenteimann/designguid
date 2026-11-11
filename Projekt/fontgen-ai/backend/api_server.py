"""
REST API Server for Font Generator

Exposes the font generation pipeline via HTTP.

Usage:
    FLASK_ENV=development FLASK_APP=api_server.py python -m flask run --port 5000

API Endpoint:
    POST /api/generate
    {
        "prompt": "elegant serif with high contrast",
        "designTokens": {
            "weight": "bold",
            "contrast": "high",
            "style": "serif",
            "mood": "elegant"
        },
        "apiKey": "sk-..."
    }
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from src.generator import FontGenerator

app = Flask(__name__)
CORS(app)  # Enable CORS for GitHub Pages frontend

# Configuration
app.config['JSON_SORT_KEYS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'FontGen AI Backend',
        'version': '0.1.0',
    })


@app.route('/api/generate', methods=['POST'])
def generate_font():
    """
    Generate font from prompt and design tokens.

    Request body:
    {
        "prompt": "elegant serif, high contrast",
        "designTokens": {
            "weight": "bold",
            "contrast": "high",
            "style": "serif",
            "mood": "elegant",
            "cap_height": 700,
            "x_height": 500
        },
        "apiKey": "sk-..." or "sk-ant-...",
        "apiType": "openai" | "anthropic" | "gemini"  # optional, default: openai
    }

    Response:
    {
        "status": "success" | "error",
        "fontId": "GenFont-Bold-20261111_120000",
        "urls": {
            "otf": "data:application/octet-stream;base64,...",
            "ttf": "...",
            "ufo": "..."
        },
        "qaReport": {...},
        "metadata": {...}
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data:
            return jsonify({'status': 'error', 'error': 'No JSON body'}), 400

        api_key = data.get('apiKey')
        if not api_key:
            return jsonify({'status': 'error', 'error': 'Missing apiKey'}), 400

        prompt = data.get('prompt', 'A clean, modern sans-serif font')
        design_tokens = data.get('designTokens', {
            'weight': 'regular',
            'contrast': 'medium',
            'style': 'sans',
            'mood': 'neutral',
        })
        api_type = data.get('apiType', 'openai')
        if api_type not in ('openai', 'anthropic', 'gemini'):
            return jsonify({'status': 'error', 'error': 'Unsupported apiType'}), 400

        # Validate design tokens
        if not isinstance(design_tokens, dict):
            return jsonify({'status': 'error', 'error': 'designTokens must be object'}), 400

        # Create generator and run
        generator = FontGenerator(api_key, api_type=api_type)
        result = generator.generate(
            prompt=prompt,
            design_tokens=design_tokens
        )

        if result['status'] == 'error':
            return jsonify(result), 500

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
        }), 500


@app.route('/api/design-tokens/schema', methods=['GET'])
def get_design_tokens_schema():
    """Return schema for design tokens."""
    return jsonify({
        'weight': {
            'type': 'string',
            'enum': ['light', 'regular', 'bold'],
            'default': 'regular',
        },
        'contrast': {
            'type': 'string',
            'enum': ['low', 'medium', 'high'],
            'default': 'medium',
        },
        'style': {
            'type': 'string',
            'enum': ['serif', 'sans', 'display'],
            'default': 'sans',
        },
        'mood': {
            'type': 'string',
            'enum': ['elegant', 'playful', 'technical', 'bold', 'neutral'],
            'default': 'neutral',
        },
        'cap_height': {
            'type': 'number',
            'default': 700,
            'description': 'Height of capital letters in font units',
        },
        'x_height': {
            'type': 'number',
            'default': 500,
            'description': 'Height of lowercase x in font units',
        },
        'stroke_ratio': {
            'type': 'number',
            'default': 0.12,
            'description': 'Stroke width as % of cap height',
        },
    })


@app.route('/api/generate/status/<font_id>', methods=['GET'])
def get_generation_status(font_id):
    """
    Poll generation status (for future async support).
    """
    return jsonify({
        'status': 'completed',
        'fontId': font_id,
        'message': 'Synchronous API - generation is immediate',
    })


@app.route('/api/errors', methods=['GET'])
def error_reference():
    """Return error code reference."""
    return jsonify({
        'errors': {
            'INVALID_API_KEY': 'API key is invalid or expired',
            'RATE_LIMITED': 'API rate limit exceeded',
            'INVALID_PROMPT': 'Prompt is too vague or invalid',
            'INVALID_TOKENS': 'Design tokens are malformed',
            'GENERATION_FAILED': 'Glyph generation failed',
            'COMPILATION_FAILED': 'Font compilation failed',
            'VALIDATION_FAILED': 'Font failed QA checks',
        }
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Run development server
    port = int(os.environ.get('PORT', 5000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True,
        use_reloader=False,  # Disable for now
    )

"""
BizRoute - AI-Driven Real-Time RoadRoute Optimization System
Main Flask application file
"""
from flask import Flask, render_template, request, jsonify
from config import Config
from utils.emissions import EmissionCalculator
import requests

app = Flask(__name__)
app.config.from_object(Config)

# Validate configuration on startup
try:
    Config.validate()
except ValueError as e:
    print(f"Configuration Error: {e}")
    print("Please check your .env file and ensure all required API keys are set.")

@app.route('/')
def index():
    """Main dashboard page."""
    return render_template('dashboard.html', title="BizRoute Dashboard")

@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'BizRoute API',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)

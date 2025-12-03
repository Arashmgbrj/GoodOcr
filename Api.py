from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from Ocr import OcrClass



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost"}})


 


UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
@app.route('/upload', methods=['POST'])
def upload_image():
   
    if 'file' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400

    if file:
        # Save the file to the uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        data = request.get_json() if request.is_json else request.form.to_dict()
        lan = data.get("language")
        c = OcrClass(file_path,lan)
        c.Load()
        c.Preprocess()
        text = c.Deriver()
     
        
        


        # Process the image (e.g., perform OCR, resize, etc.)
        # For now, just return a success message
        
        return jsonify({'message': text}), 200
    


        
if __name__ == '__main__':
    app.run(debug=True)
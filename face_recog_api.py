from flask import Flask, request, jsonify
import os
import face_recognition
from deepface import DeepFace

app = Flask(__name__)

def check_face_recognition(image_of_person_1, image_of_person_2):
    try:
        image_of_person_1 = face_recognition.load_image_file(image_of_person_1)
        image_of_person_2 = face_recognition.load_image_file(image_of_person_2)

        person_1_face_encoding = face_recognition.face_encodings(image_of_person_1)[0]
        person_2_face_encoding = face_recognition.face_encodings(image_of_person_2)[0]

        face_distance = face_recognition.face_distance([person_1_face_encoding], person_2_face_encoding)[0]
        is_same_person = face_distance < 0.6

        if is_same_person:
            return f"SAME PERSON (Distance: {face_distance:.4f})"
        else:
            return f"DIFFERENT PEOPLE (Distance: {face_distance:.4f})"

    except IndexError:
        return "No faces detected in one or both images"
    except Exception as e:
        return f"Error: {e}"


def check_deepface(image_of_person_1, image_of_person_2):
    try:
        result = DeepFace.verify(image_of_person_1, image_of_person_2)
        if result["verified"]:
            return f"SAME PERSON (Confidence: {result['distance']:.4f})"
        else:
            return f"DIFFERENT PEOPLE (Confidence: {result['distance']:.4f})"
    except Exception as e:
        return f"Error: {e}"

@app.route('/compare', methods=['POST'])
def compare_faces():
    try:
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({"error": "Both images are required"}), 400

        image_one = request.files['image1']
        image_two = request.files['image2']

        face_recognition_result = check_face_recognition(image_one, image_two)
        deepface_result = check_deepface(image_one, image_two)

        return jsonify({
            "face_recognition_result": face_recognition_result,
            "deepface_result": deepface_result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

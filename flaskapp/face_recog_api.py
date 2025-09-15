from flask import Flask, request, jsonify
import face_recognition

app = Flask(__name__)


def check_face_recognition(image_of_person_1, image_of_person_2):
    """
    Compares two images and determines if they contain the same person.
    Returns a dictionary and a status code.
    """
    try:
        # Load images directly from the FileStorage object's stream
        img1 = face_recognition.load_image_file(image_of_person_1)
        img2 = face_recognition.load_image_file(image_of_person_2)

        # Get face encodings. This returns a list of encodings.
        img1_encodings = face_recognition.face_encodings(img1)
        img2_encodings = face_recognition.face_encodings(img2)

        # Check if any faces were found in the images
        if not img1_encodings:
            return {"success": False, "error": "No face found in the first image."}, 400
        if not img2_encodings:
            return {
                "success": False,
                "error": "No face found in the second image.",
            }, 400

        # Take the first face found in each image
        person_1_face_encoding = img1_encodings[0]
        person_2_face_encoding = img2_encodings[0]

        # Compare faces and get the distance
        face_distance = face_recognition.face_distance(
            [person_1_face_encoding], person_2_face_encoding
        )[0]

        # The threshold of 0.6 is a common starting point.
        is_same_person = face_distance < 0.6

        if is_same_person:
            return {"success": True, "dist": f"{face_distance:.4}"}, 200
        else:
            return {
                "success": False,
                "dist": f"{face_distance:.4}",
                "error": "Faces do not match.",
            }, 200

    except Exception as e:
        return {"success": False, "error": str(e)}, 500


@app.route("/compare", methods=["POST"])
def compare_faces():
    """
    Flask route to handle face comparison requests.
    """
    try:
        if "image1" not in request.files or "image2" not in request.files:
            return (
                jsonify(
                    {"success": False, "error": "Both image1 and image2 are required."}
                ),
                400,
            )

        image_one = request.files["image1"]
        image_two = request.files["image2"]

        # Call the checking function which now returns a dictionary and status code
        result_dict, status_code = check_face_recognition(image_one, image_two)

        # Return the JSON response correctly
        return jsonify(result_dict), status_code

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5004, debug=True)

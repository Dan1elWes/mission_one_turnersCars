import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  // Clear the image URL when a file is selected  
    setImageUrl(""); 
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  // Clear the file when an URL is entered
    setImage(null); 
  };

  // Send the image to Azure for prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !imageUrl) {
      alert("Please upload an image or provide an image URL.");
      return;
    }

    setLoading(true);

    const imageFilePredictionUrl =
      "https://turnerscarsprediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/6a5bcc34-add4-4961-82ed-85ae57bddf2c/classify/iterations/Iteration1/image";
    const imageUrlPredictionUrl =
      "https://turnerscarsprediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/6a5bcc34-add4-4961-82ed-85ae57bddf2c/classify/iterations/Iteration1/url";
    const apiKey = "5QSnME6Cgjxlcfp3QgAv1Ox7ecA68ns3MWPB8QMh34G32vnEo5xCJQQJ99AKACL93NaXJ3w3AAAIACOGQA2O"; 

    try {
      let response;

      if (image) {
        // Handle file upload
        const formData = new FormData();
        formData.append("file", image);

        response = await axios.post(imageFilePredictionUrl, formData, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Prediction-Key": apiKey,
          },
        });
      } else if (imageUrl) {
        // Handle image URL input
        response = await axios.post(
          imageUrlPredictionUrl,
          { url: imageUrl },
          {
            headers: {
              "Content-Type": "application/json",
              "Prediction-Key": apiKey,
            },
          }
        );
      }

      setPrediction(response.data.predictions);
    } catch (error) {
      console.error("Error with prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image for Custom Vision Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <label>Or Enter Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="Enter image URL"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {prediction && (
        <div>
          <h2>Prediction Results</h2>
          <ul>
            {prediction.map((item) => (
              <li key={item.tagName}>
                {item.tagName}: {item.probability * 100}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;



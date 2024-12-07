import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";  // Your Firebase config file
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";  // Firebase Storage imports
import { useNavigate } from "react-router-dom";  // For navigation (optional)

const AdminHeroSection = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [imageFile, setImageFile] = useState(null);  // State to hold the selected file
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview URL
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);  // State for upload progress

  // For navigation (optional)
  const navigate = useNavigate();

  // Fetch current Hero Section data from Firestore
  useEffect(() => {
    const fetchHeroData = async () => {
      const docRef = doc(db, "heroSection", "1");  // Document with ID "1"
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeading(data.heading);
        setSubheading(data.subheading);
        setImageFile(null);  // Reset image to null if not needed
        setImagePreview(data.imageUrl);  // Set the existing image preview if any
      } else {
        console.log("No such document!");
      }
    };

    fetchHeroData();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);  // Set the selected file in state

      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);  // Set the image preview URL
      };
      reader.readAsDataURL(file);  // Read the file as a data URL
    }
  };

  // Handle form submission to update Hero Section in Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        // Step 1: Upload image to Firebase Storage
        const storageRef = ref(storage, `hero-images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        // Step 2: Track upload progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (error) => {
            console.error("Error uploading image: ", error);
            setLoading(false);
            alert("Error uploading image. Please try again.");
          },
          async () => {
            // Step 3: Get the download URL after the upload is complete
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            // Step 4: Update Firestore with the new data
            const docRef = doc(db, "heroSection", "1");
            await setDoc(docRef, {
              heading: heading,
              subheading: subheading,
              imageUrl: imageUrl,  // Save the image URL in Firestore
            });

            alert("Hero Section updated successfully!");
            setLoading(false);
            navigate("/admin");  // Optional: navigate to another page
          }
        );
      } else {
        // If no image selected, just update Firestore with text data
        const docRef = doc(db, "heroSection", "1");
        await setDoc(docRef, {
          heading: heading,
          subheading: subheading,
        });
        alert("Hero Section updated successfully!");
        setLoading(false);
        navigate("/admin");  // Optional: navigate to another page
      }
    } catch (error) {
      console.error("Error updating Hero Section: ", error);
      alert("Failed to update Hero Section. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-hero-section">
      <h2 className="text-2xl font-bold mb-6">Edit Hero Section</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="heading" className="block text-lg font-medium">Heading</label>
          <input
            type="text"
            id="heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Enter Heading"
            className="w-full p-3 mt-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="subheading" className="block text-lg font-medium">Subheading</label>
          <input
            type="text"
            id="subheading"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            placeholder="Enter Subheading"
            className="w-full p-3 mt-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="imageFile" className="block text-lg font-medium">Upload Image</label>
          <input
            type="file"
            id="imageFile"
            onChange={handleFileChange}
            className="w-full p-3 mt-2 border rounded-md"
          />
          {imageFile && <p className="mt-2">File Selected: {imageFile.name}</p>}
        </div>

        {imagePreview && (
          <div className="mt-4">
            <p className="text-lg font-medium">Image Preview:</p>
            <img src={imagePreview} alt="Image Preview" className="w-full h-auto mt-2 border rounded-md" />
          </div>
        )}

        <div className="progress-bar mt-4">
          {progress > 0 && <p>Upload Progress: {Math.round(progress)}%</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Hero Section"}
        </button>
      </form>
    </div>
  );
};

export default AdminHeroSection;

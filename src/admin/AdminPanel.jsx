import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";  // Your Firebase config file
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";  // Firebase Storage imports
import { useNavigate } from "react-router-dom";  // For navigation (optional)

const AdminHeroSection = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [imageFile, setImageFile] = useState(null);  // State to hold the selected file
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview URL
  const [cvFile, setCvFile] = useState(null);  // State to hold the selected CV file
  const [cvUrl, setCvUrl] = useState("");  // State to store the CV download URL
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);  // State for upload progress

  const navigate = useNavigate();

  // Fetch current Hero Section and CV data from Firestore
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

      // Fetch CV data
      const cvDocRef = doc(db, "cvSection", "1");  // Document with ID "1" for CV
      const cvDocSnap = await getDoc(cvDocRef);
      if (cvDocSnap.exists()) {
        const cvData = cvDocSnap.data();
        setCvUrl(cvData.cvUrl);  // Set the CV URL from Firestore
      } else {
        console.log("No CV document found!");
      }
    };

    fetchHeroData();
  }, []);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);  // Set the selected image file in state

      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);  // Set the image preview URL
      };
      reader.readAsDataURL(file);  // Read the file as a data URL
    }
  };

  // Handle CV file selection
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);  // Set the selected CV file in state
    }
  };

  // Handle form submission to update Hero Section and CV
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
      }

      // Handle CV upload if a file is selected
      if (cvFile) {
        const cvRef = ref(storage, `cv-files/${cvFile.name}`);
        const cvUploadTask = uploadBytesResumable(cvRef, cvFile);

        cvUploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (error) => {
            console.error("Error uploading CV: ", error);
            setLoading(false);
            alert("Error uploading CV. Please try again.");
          },
          async () => {
            const cvDownloadUrl = await getDownloadURL(cvUploadTask.snapshot.ref);

            // Step 5: Save the CV URL in Firestore
            const cvDocRef = doc(db, "cvSection", "1");
            await setDoc(cvDocRef, { cvUrl: cvDownloadUrl });
            setCvUrl(cvDownloadUrl);  // Update CV URL in state

            alert("CV uploaded successfully!");
          }
        );
      } else {
        alert("Hero Section and CV updated successfully!");
      }

      setLoading(false);
      navigate("/admin");  // Optional: navigate to another page
    } catch (error) {
      console.error("Error updating Hero Section or CV: ", error);
      alert("Failed to update. Please try again.");
      setLoading(false);
    }
  };

  // Handle CV file deletion
  const handleDeleteCv = async () => {
    if (window.confirm("Are you sure you want to delete the CV?")) {
      try {
        // Delete CV from Firebase Storage
        const cvRef = ref(storage, cvUrl);
        await deleteObject(cvRef);

        // Remove CV URL from Firestore
        const cvDocRef = doc(db, "cvSection", "1");
        await deleteDoc(cvDocRef);

        alert("CV deleted successfully!");
        setCvUrl("");  // Clear CV URL from state
      } catch (error) {
        console.error("Error deleting CV: ", error);
        alert("Failed to delete CV. Please try again.");
      }
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
            onChange={handleImageChange}
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

      {/* CV Upload and Preview */}
      <div className="mt-8">
        <h3 className="text-xl font-bold">Upload/Edit CV</h3>
        <input
          type="file"
          onChange={handleCvChange}
          className="w-full p-3 mt-2 border rounded-md"
        />
        {cvFile && <p className="mt-2">File Selected: {cvFile.name}</p>}
        
        {cvUrl && (
          <div className="mt-4">
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Current CV
            </a>
            <button
              type="button"
              onClick={handleDeleteCv}
              className="ml-4 text-red-500"
            >
              Delete CV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeroSection;

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
      const docRef = doc(db, "byteedocheroSection", "1");  // Document with ID "1"
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
      const cvDocRef = doc(db, "byteedoccvSection", "1");  // Document with ID "1" for CV
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
        const storageRef = ref(storage, `byteedochero-images/${imageFile.name}`);
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
            const docRef = doc(db, "byteedocheroSection", "1");
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
        const docRef = doc(db, "byteedocheroSection", "1");
        await setDoc(docRef, {
          heading: heading,
          subheading: subheading,
        });
        alert("Hero Section updated successfully!");
      }

      // Handle CV upload if a file is selected
      if (cvFile) {
        const cvRef = ref(storage, `byteedoccv-files/${cvFile.name}`);
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
            const cvDocRef = doc(db, "byteedoccvSection", "1");
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
        const cvDocRef = doc(db, "byteedoccvSection", "1");
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
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-white border-b border-white/10 pb-4">Edit Hero Section</h2>

      <div className="glass-panel p-8 rounded-2xl animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-400 mb-2">Heading</label>
              <input
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Enter Heading"
                className="w-full bg-black-100/50 border border-white/10 rounded-xl p-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="subheading" className="block text-sm font-medium text-gray-400 mb-2">Subheading</label>
              <input
                type="text"
                id="subheading"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="Enter Subheading"
                className="w-full bg-black-100/50 border border-white/10 rounded-xl p-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-400 mb-2">Upload Hero Image</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    id="imageFile"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-gray-400">
                    {imageFile ? <span className="text-accent">{imageFile.name}</span> : "Click to Upload or Drag & Drop"}
                </div>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4 p-4 bg-black-100/30 rounded-xl border border-white/5">
              <p className="text-sm font-medium text-gray-400 mb-2">Preview:</p>
              <img src={imagePreview} alt="Image Preview" className="h-48 object-contain rounded-lg mx-auto" />
            </div>
          )}

          {progress > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                 <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
          )}

          <button
            type="submit"
            className="w-full primary-btn mt-6"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* CV Upload Section */}
      <div className="mt-12 glass-panel p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">CV Management</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-400 mb-2">Upload New CV</label>
                 <div className="flex gap-4">
                    <input
                    type="file"
                    onChange={handleCvChange}
                    className="flex-1 bg-black-100/50 border border-white/10 rounded-xl p-3 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                    />
                 </div>
                 {cvFile && <p className="mt-2 text-sm text-accent">Selected: {cvFile.name}</p>}
             </div>
             
             {cvUrl && (
                <div className="flex flex-col gap-3 min-w-[200px]">
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-center text-sm font-medium text-blue-400 transition-colors border border-white/5">
                    View Current CV
                    </a>
                    <button
                    type="button"
                    onClick={handleDeleteCv}
                    className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-medium transition-colors border border-red-500/20"
                    >
                    Delete CV
                    </button>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeroSection;

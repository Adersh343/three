// AdminPanel.js
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FaPlus } from "react-icons/fa"; // Plus icon
import { FiEdit, FiDelete } from "react-icons/fi"; // Edit and Delete icons

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    image: null,
    githubLink: "",
    liveDemoLink: "",
  });
  const [projects, setProjects] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const snapshot = await getDocs(projectsCollection);
      const projectList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(projectList);
    };

    fetchProjects();
  }, [projects]); // re-fetch projects when a new one is added or deleted

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.image) {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `projects/${formData.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optionally handle the upload progress
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          // Get the download URL after the image is uploaded
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add the project data to Firestore
          try {
            await addDoc(collection(db, "projects"), {
              name: formData.name,
              description: formData.description,
              tags: formData.tags,
              image: imageUrl,
              githubLink: formData.githubLink,
              liveDemoLink: formData.liveDemoLink,
            });
            alert("Project added successfully!");
            setFormData({
              name: "",
              description: "",
              tags: "",
              image: null,
              githubLink: "",
              liveDemoLink: "",
            });
            setFormVisible(false); // Hide form after submission
          } catch (error) {
            console.error("Error adding document: ", error);
          }
        }
      );
    } else {
      alert("Please upload an image.");
    }
  };

  const handleEdit = async (id) => {
    const projectToEdit = projects.find((project) => project.id === id);
    setFormData({ ...projectToEdit });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    const projectDocRef = doc(db, "projects", id);
    await deleteDoc(projectDocRef);
    alert("Project deleted successfully!");
  };

  return (
    <div className="admin-panel-container">
      <div className="header flex justify-between items-center p-4 bg-blue-500 text-white">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button
          onClick={() => setFormVisible(!isFormVisible)}
          className="bg-green-500 p-3 rounded-full text-white"
        >
          <FaPlus size={20} />
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="project-form p-6 bg-gray-100 shadow-md rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add Project</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="input-field mb-4"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="input-field mb-4"
            required
          />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleTagChange}
            placeholder="Tags (comma-separated)"
            className="input-field mb-4"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="input-field mb-4"
            required
          />
          <input
            type="text"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            placeholder="GitHub Link"
            className="input-field mb-4"
            required
          />
          <input
            type="text"
            name="liveDemoLink"
            value={formData.liveDemoLink}
            onChange={handleChange}
            placeholder="Live Demo Link"
            className="input-field mb-4"
            required
          />
          <button type="submit" className="submit-btn mt-4">
            {formData.id ? "Update Project" : "Add Project"}
          </button>
        </form>
      )}

      <div className="projects-list p-6">
        <h3 className="text-xl font-semibold mb-4">Projects</h3>
        <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="project-card bg-white shadow-md rounded-lg p-4">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h4 className="text-lg font-bold mt-2">{project.name}</h4>
              <p className="text-sm mt-1">{project.description}</p>
              <div className="actions mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleEdit(project.id)}
                  className="edit-btn text-blue-500"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="delete-btn text-red-500"
                >
                  <FiDelete size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

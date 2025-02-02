import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Import Firebase functions
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Fetch contacts from Firestore
    const fetchContacts = async () => {
      const querySnapshot = await getDocs(collection(db, "byteedoccontacts"));
      const contactsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactsList);
    };

    fetchContacts();
  }, []);

  // Delete contact by ID
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "byteedoccontacts", id));
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <h2 className="text-3xl font-semibold text-center text-primary mb-8">
        Contact Submissions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-xl text-gray-800">{contact.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(contact.timestamp.seconds * 1000).toLocaleString()}
              </div>
            </div>
            <p className="mt-2 text-gray-600">{contact.message}</p>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleDelete(contact.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
              <div className="text-sm text-gray-500">Email: {contact.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContacts;

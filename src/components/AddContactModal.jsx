import React, { useState } from "react";

export default function AddContactModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return setError("Name is required");
    if (!/^[+]?[0-9\s]+$/.test(phone)) return setError("Phone must be digits only");
    if (!email.includes("@")) return setError("Invalid email address");
    onAdd({ name, phone, email, notes, fav: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Add New Contact</h2>
        <div className="flex flex-col gap-2">
          <input
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
            placeholder="Phone (+91 XXXXXXXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-400 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Add</button>
        </div>
      </div>
    </div>
  );
}

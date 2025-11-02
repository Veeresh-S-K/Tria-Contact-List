import React, { useState } from "react";
import { Star, StarBorder, Edit, Delete } from "@mui/icons-material";

export default function ContactCard({ contact, onDelete, onEdit, onFav }) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [temp, setTemp] = useState(contact);

  const handleSave = () => {
    onEdit(temp);
    setEditMode(false);
  };

  return (
    <div
      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all border border-white/10"
      onClick={() => !editMode && setExpanded(!expanded)}
    >
      {editMode ? (
        <div className="flex flex-col gap-2">
          <input
            className="bg-transparent border-b border-gray-400 focus:outline-none"
            value={temp.name}
            onChange={(e) => setTemp({ ...temp, name: e.target.value })}
          />
          <input
            className="bg-transparent border-b border-gray-400 focus:outline-none"
            value={temp.phone}
            onChange={(e) => setTemp({ ...temp, phone: e.target.value })}
          />
          <input
            className="bg-transparent border-b border-gray-400 focus:outline-none"
            value={temp.email}
            onChange={(e) => setTemp({ ...temp, email: e.target.value })}
          />
          <textarea
            className="bg-transparent border border-gray-400 rounded p-1"
            value={temp.notes}
            onChange={(e) => setTemp({ ...temp, notes: e.target.value })}
          />
          <button
            onClick={handleSave}
            className="self-end bg-purple-500 px-3 py-1 rounded hover:bg-purple-600"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{contact.name}</h2>
            <div className="flex gap-2">
              <button onClick={() => onFav(contact.id)}>
                {contact.fav ? <Star /> : <StarBorder />}
              </button>
              <button onClick={() => setEditMode(true)}>
                <Edit />
              </button>
              <button onClick={() => onDelete(contact.id)}>
                <Delete />
              </button>
            </div>
          </div>
          <p className="text-gray-200">{contact.phone}</p>
          {expanded && (
            <div className="mt-2 text-gray-300 text-sm">
              <p>{contact.email}</p>
              <p>{contact.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

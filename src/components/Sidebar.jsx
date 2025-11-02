import React, { useState } from "react";
import { Menu, Star, People } from "@mui/icons-material";

export default function Sidebar({ filter, setFilter }) {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`${
        open ? "w-56" : "w-16"
      } bg-purple-700 dark:bg-gray-900 p-4 transition-all flex flex-col`}
    >
      <button
        className="mb-6 flex items-center justify-center hover:scale-110 transition"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </button>
      <button
        onClick={() => setFilter("all")}
        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-purple-600 transition ${
          filter === "all" && "bg-purple-600"
        }`}
      >
        <People />
        {open && "All Contacts"}
      </button>
      <button
        onClick={() => setFilter("favourites")}
        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-purple-600 transition ${
          filter === "favourites" && "bg-purple-600"
        }`}
      >
        <Star />
        {open && "Favourites"}
      </button>
    </div>
  );
}

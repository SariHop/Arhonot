"use client";
import React, { useState, useEffect } from "react";
import { fetchSeasons, fetchTags } from "@/app/services/categoriesService";
import { toast } from "react-toastify";
import useUser from "@/app/store/userStore";

const GarmentForm = () => {
  const { _id } = useUser((state) => state);
  console.log(_id);

  const [seasons, setSeasons] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories, tags, and seasons data
    Promise.all([fetchSeasons(), fetchTags()])
      .then(([fetchedSeasons, fetchedTags]) => {
        setSeasons(fetchedSeasons);
        setTags(fetchedTags);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      });
  }, []);

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags((prevTags) =>
      checked ? [...prevTags, tag] : prevTags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add selected tags as a comma-separated string
    formData.append("tags", selectedTags.join(","));
    // להוסיף למערך ולא לסטרינג

    console.log(formData);
    // console.log("FormData values:");
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    // Here you would send the formData to the server
    // Example: await createGarment(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-4 bg-white rounded shadow-md space-y-4 mb-12"
    >

      {/* Select Season */}
      <select name="season" className="w-full p-2 border rounded" required>
        <option value="">בחר עונה</option>
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>

      {/* Description */}
      <textarea
        name="desc"
        placeholder="הוסף תיאור (אופציונלי)"
        className="w-full p-2 border rounded"
      ></textarea>

      {/* Range Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="range">לאיזה מזג אוויר הלוק הזה מתאים? </label>
        {/* קפוא, קר, קריר, נעים, חמים, חם, רותח */}
        <input
          type="range"
          name="range"
          id="range"
          min="1"
          max="7"
          defaultValue="4"
          className="w-full"
        />
      </div>

      {/* Tags Selection */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">בחר תגית</h3>
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <label
              key={tag}
              className="flex items-center p-2 border rounded cursor-pointer"
            >
              <input
                type="checkbox"
                value={tag}
                onChange={(e) =>
                  handleTagChange(tag, e.target.checked)
                }
                className="mr-2"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Create Garment
      </button>
    </form>
  );
};

export default GarmentForm;

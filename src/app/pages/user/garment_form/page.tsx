"use client";
import React, { useState } from "react";
import { garmentSchemaZod, IGarmentType } from "@/app/types/IGarment";
import { toast } from "react-toastify";
import { createGarment } from "@/app/services/garmentService";
import useUser from "@/app/store/userStore";
import { ZodError } from "zod";
import UploadImage from "@/app/components/imagesUploud/UploudButton";
import Image from "next/image";
import { ColorPicker } from "antd";
import {validSeasons, typeCategories, tags, rangeWheatherDeescription} from "@/app/data/staticArrays"

const GarmentForm = () => {
  const { _id } = useUser((state) => state);
  console.log("User ID from store:", _id);

  const [formData, setFormData] = useState<IGarmentType>({
    desc: "",
    season: "",
    range: 1,
    category: "",
    color: "",
    link: "",
    price: 0,
    tags: [],
  });

  // const { data: tags, isLoading: isLoadingTag, error: errorTag } = useTagQuery();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string>("");


  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string } } // סמן שינוי
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? value === ""
            ? 0
            : Number(value)
          : name === "range"
          ? Number(value)
          : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newTags = checked
        ? [...prev.tags, value]
        : prev.tags.filter((tag) => tag !== value);
      return {
        ...prev,
        tags: newTags,
      };
    });
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await garmentSchemaZod.parseAsync(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0 && typeof err.path[0] === "string") {
            validationErrors[err.path[0]] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const garmentWithUserId = { ...formData, userId: _id, img: imageUrl };
      console.log("User ID from store:", _id);
      console.log("Form Data before submit:", formData);
      console.log("Garment object with User ID:", garmentWithUserId);

      try {
        await createGarment(garmentWithUserId);
        toast.success("Garment created successfully!");
        setFormData({
          desc: "",
          season: "",
          range: 1,
          category: "",
          color: "",
          link: "",
          price: 0,
          tags: [],
        });
        setImageUrl("");
      } catch (error) {
        console.error("Error creating garment:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-7 bg-white rounded shadow-md space-y-4 "
    >
      <h1 className="text-2xl font-semibold text-center">Create Garment</h1>
      <UploadImage setCloudinary={setImageUrl} />
      {imageUrl && (
        <Image
          width="120"
          height="75"
          src={imageUrl}
          sizes="100vw"
          alt="Description of my image"
        />
      )}
      <select
        name="season"
        value={formData.season}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Season</option>
        {validSeasons.map((season:string) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>
      {errors.season && <p className="text-red-500 text-sm">{errors.season}</p>}

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {typeCategories.map((category:string) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {errors.category && (
        <p className="text-red-500 text-sm">{errors.category}</p>
      )}
      <textarea
        name="desc"
        placeholder="Description (optional)"
        value={formData.desc}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      ></textarea>

      <div className="flex items-center space-x-4">
        {/* שדה הטווח */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="flex justify-between w-full">
            {/* <p>לאיזה מזג אוויר הלוק הזה מתאים?</p> */}
            <span className="text-sm">חם</span>
            <span className="text-sm">קר</span>
          </div>
          <input
            type="range"
            name="range"
            min="1"
            max="7"
            step="1"
            value={formData.range}
            onChange={handleChange}
            className="w-full mt-2"
          />
           <p className="text-center mt-2"> {rangeWheatherDeescription[formData.range-1]}</p>
        </div>

        {/* שדה המחיר */}
        <div className="w-1/2">
          <input
            type="number"
            name="price"
            placeholder="Price (optional)"
            value={formData.price === 0 ? "" : formData.price}
            onChange={(e) => handleChange(e)}
            min="0"
            inputMode="numeric"
            className="w-full p-2 border rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>
      </div>

      <input
        type="url"
        name="link"
        placeholder="Link (optional)"
        value={formData.link}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Color</h3>
        <ColorPicker
          onChangeComplete={
            (color) =>
              handleChange({
                target: { name: "color", value: color.toHexString() },
              }) 
          }
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Tags</h3>
        <div className="flex flex-wrap gap-4">
          {tags.map((tag:string) => (
            <label
              key={tag}
              className={`flex items-center p-2 border rounded cursor-pointer ${
                formData.tags.includes(tag)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              <input
                type="checkbox"
                value={tag}
                checked={formData.tags.includes(tag)}
                onChange={handleTagsChange}
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

import { useState } from "react";
import { toast } from "react-toastify";

const BlogForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [blogImageBase64, setBlogImageBase64] = useState(
    initialData.blogImage || null
  );
  const [previewImage, setPreviewImage] = useState(
    initialData.blogImage || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setBlogImageBase64(base64);
        setPreviewImage(base64);
      } catch (err) {
        toast.error("Image conversion failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title,
        description,
        blogImage: blogImageBase64,
      };

      if (isEditing && initialData._id) {
        payload.blogId = initialData._id;
      }

      await onSubmit(payload); // send as JSON
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Blog Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
        />
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
        />
      </div>

      {/* Image Upload and Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blog Image
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="flex-shrink-0 h-32 w-32 rounded-md overflow-hidden bg-gray-100">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                className="h-full w-full text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v12H4z" />
              </svg>
            )}
          </div>
          <label
            htmlFor="blog-image-upload"
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 cursor-pointer"
          >
            <span>{previewImage ? "Change" : "Upload"}</span>
            <input
              id="blog-image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="ml-3 inline-flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : isEditing ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { ROUTES } from "../../utils/constants";
import BlogForm from "../../components/BlogForm";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../services/api";
import { ROUTES } from "../utils/constants";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blog/getBlogById?blogId=${id}`);
        setBlog(response.data.result);
      } catch (error) {
        toast.error("Failed to fetch blog details");
        navigate(ROUTES.BLOGS.LIST);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await api.put("/blog/editBlog", formData);
      toast.success("Blog updated successfully!");
      navigate(`${ROUTES.BLOGS.DETAILS.replace(":id", id)}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.responseMessage || "Failed to update blog"
      );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog</h1>
        <BlogForm onSubmit={handleSubmit} initialData={blog} isEditing={true} />
      </div>
    </DashboardLayout>
  );
};

export default EditBlog;

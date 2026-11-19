import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProducts } from "../context/ProductsContext";
import { CATEGORIES } from "../constants/categories";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number")
    .min(0, "Price must be greater than 0"),
  category: Yup.string()
    .oneOf(CATEGORIES, "Invalid category")
    .required("Category is required"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Only JPG, PNG or WEBP allowed", (file) =>
      file
        ? ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        : false,
    )
    .test("fileSize", "Image must be under 2MB", (file) =>
      file ? file.size <= 2 * 1024 * 1024 : false,
    ),
});

function AddProductPage() {
  const [preview, setPreview] = useState(null);
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("image", values.image);

        await addProduct(formData);
        toast.success("Product added successfully!");
        navigate("/products");
      } catch (err) {
        setServerError(err.message);
        toast.error("Failed to add product: " + err.message);
      }
    },
  });

  const inputClass =
    "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  useEffect(() => {
    const file = formik.values.image;
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formik.values.image]);

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Add Product</h1>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-600">{formik.errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-sm text-red-600">{formik.errors.price}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-sm text-red-600">{formik.errors.category}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) =>
              formik.setFieldValue("image", e.currentTarget.files[0])
            }
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-sm text-red-600">{formik.errors.image}</p>
          )}
          {preview && formik.values.image?.type.startsWith("image/") && (
            <img
              src={preview}
              alt="Selected preview"
              className="mt-2 h-40 w-40 rounded border object-cover"
            />
          )}
        </div>

        {serverError && <p className="text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {formik.isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
export default AddProductPage;

import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useProducts} from "../context/ProductsContext";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home"];

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  price: Yup.number().required("Price is required").positive("Price must be positive").typeError("Price must be a number").min(0, "Price must be greater than 0"),
  category: Yup.string().oneOf(CATEGORIES, "Invalid category").required("Category is required"),
  image: Yup.string().url("Invalid URL").required("Image URL is required"),
});

function AddProductPage() {
  const {addProduct} = useProducts();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      image: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError(null);
      try {
        await addProduct(values);
        navigate("/products");
      }
      catch (error) {
        setServerError(error.message || "An error occurred while adding the product");
      }
    }
  });

  const inputClass = "border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
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
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-sm text-red-600">{formik.errors.image}</p>
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

import {useProducts} from "../context/ProductsContext.jsx";

function ProductsPage() {
    const data = useProducts();
    console.log(data);
    

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Products Page</h1>
    </div>
  );
}

export default ProductsPage;
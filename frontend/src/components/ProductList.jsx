import { useState } from "react";
import { productsAPI } from "../services/api";

const ProductList = ({ products, onEdit, onRefresh }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleteLoading(productId);
    try {
      const response = await productsAPI.delete(productId);
      if (response.success) {
        onRefresh();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("Error deleting product");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found. Add your first product above!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h3>Products ({products.length})</h3>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-header">
              <h4>{product.name}</h4>
              <span className="product-sku">SKU: {product.sku}</span>
            </div>

            <div className="product-details">
              <p className="product-description">{product.description}</p>
              <div className="product-info">
                <span className="product-price">
                  ${product.price.toFixed(2)}
                </span>
                <span className="product-quantity">
                  Qty: {product.quantity}
                </span>
                <span className="product-category">{product.category}</span>
              </div>
            </div>

            <div className="product-actions">
              <button onClick={() => onEdit(product)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="delete-btn"
                disabled={deleteLoading === product._id}
              >
                {deleteLoading === product._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

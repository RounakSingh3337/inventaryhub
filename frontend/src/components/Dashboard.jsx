import { useState, useEffect } from "react";
import { productsAPI } from "../services/api";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const Dashboard = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      if (response.success) {
        setProducts(response.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = () => {
    fetchProducts();
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
  };

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const lowStockProducts = products.filter((product) => product.quantity < 10);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Inventory Management System</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <span className="stat-number">{products.length}</span>
          </div>
          <div className="stat-card">
            <h3>Total Inventory Value</h3>
            <span className="stat-number">${totalValue.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <h3>Low Stock Items</h3>
            <span className="stat-number">{lowStockProducts.length}</span>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-header">
            <button
              onClick={() => setShowForm(!showForm)}
              className="add-product-btn"
            >
              {showForm ? "Hide Form" : "Add New Product"}
            </button>
          </div>

          {showForm && (
            <ProductForm
              editingProduct={editingProduct}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <ProductList
              products={products}
              onEdit={handleEdit}
              onRefresh={fetchProducts}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

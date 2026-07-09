import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', discount: '0', category_id: '', brand: '', stock: '0' });
  const [imageFile, setImageFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await adminAPI.products.getAll();
      setProducts(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await adminAPI.products.update(editItem.id, {
          ...form,
          price: parseFloat(form.price),
          discount: parseFloat(form.discount),
          category_id: parseInt(form.category_id),
          stock: parseInt(form.stock),
        });
        toast.success('Product updated');
      } else {
        await adminAPI.products.create({
          ...form,
          price: parseFloat(form.price),
          discount: parseFloat(form.discount),
          category_id: parseInt(form.category_id),
          stock: parseInt(form.stock),
        });
        toast.success('Product created');
      }
      closeModal();
      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.products.delete(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleImageUpload = async (id, file) => {
    try {
      await adminAPI.products.uploadImage(id, file);
      toast.success('Image uploaded');
      loadProducts();
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleMultipleUpload = async (id, files) => {
    try {
      await adminAPI.products.uploadMultipleImages(id, files);
      toast.success('Images uploaded');
      loadProducts();
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', price: '', discount: '0', category_id: '', brand: '', stock: '0' });
    setImageFile(null);
    setExtraFiles([]);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      discount: String(item.discount ?? 0),
      category_id: String(item.category_id),
      brand: item.brand || '',
      stock: String(item.stock ?? 0),
    });
    setImageFile(null);
    setExtraFiles([]);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">Add Product</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No products found.</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">${p.price?.toFixed(2)}</td>
                <td className="px-4 py-3">{p.brand}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                  <label className="text-green-600 hover:underline cursor-pointer">
                    Upload Image
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(p.id, e.target.files[0])} />
                  </label>
                  <label className="text-indigo-600 hover:underline cursor-pointer">
                    Upload Multiple
                    <input type="file" multiple className="hidden" onChange={(e) => handleMultipleUpload(p.id, Array.from(e.target.files))} />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editItem ? 'Edit Product' : 'New Product'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" step="0.01" className="border rounded-lg px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <input type="number" step="0.01" className="border rounded-lg px-3 py-2" placeholder="Discount" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                <input type="number" className="border rounded-lg px-3 py-2" placeholder="Category ID" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required />
                <input className="border rounded-lg px-3 py-2" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                <input type="number" className="border rounded-lg px-3 py-2" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

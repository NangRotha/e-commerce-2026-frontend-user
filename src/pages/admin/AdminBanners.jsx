import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', link: '', is_active: true });
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const res = await adminAPI.banners.getAll();
      setBanners(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await adminAPI.banners.update(editItem.id, form);
        toast.success('Banner updated');
      } else {
        await adminAPI.banners.create(form);
        toast.success('Banner created');
      }
      closeModal();
      loadBanners();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await adminAPI.banners.delete(id);
      toast.success('Banner deleted');
      loadBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const handleImageUpload = async (id, file) => {
    try {
      await adminAPI.banners.uploadImage(id, file);
      toast.success('Banner image uploaded');
      loadBanners();
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await adminAPI.banners.toggle(id);
      toast.success('Banner status toggled');
      loadBanners();
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', subtitle: '', image_url: '', link: '', is_active: true });
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title, subtitle: item.subtitle || '', image_url: item.image_url || '', link: item.link || '', is_active: item.is_active ?? true });
    setFile(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">Add Banner</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.length === 0 && (
          <div className="text-gray-500 col-span-full text-center py-10">No banners found.</div>
        )}
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {b.image_url && (
              <img src={b.image_url} alt={b.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.subtitle}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.is_active ? 'Active' : 'Inactive'}</span>
                <div className="space-x-2">
                  <button onClick={() => toggleStatus(b.id)} className="text-xs text-blue-600 hover:underline">Toggle</button>
                  <button onClick={() => openEdit(b)} className="text-xs text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                  <label className="text-xs text-green-600 hover:underline cursor-pointer">
                    Image
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(b.id, e.target.files[0])} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editItem ? 'Edit Banner' : 'New Banner'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span className="text-sm">Active</span>
              </label>
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

export default AdminBanners;

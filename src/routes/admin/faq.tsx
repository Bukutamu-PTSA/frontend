import React, { useState, useMemo } from 'react';
import {
  Home,
  Layers,
  AlertCircle,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Check,
  CheckCircle2,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Interface Data FAQ
export interface FAQItem {
  id: string | number;
  pertanyaan: string;
  jawaban: string;
  statusVisibilitas: 'Publikasi Langsung' | 'Draft' | 'Arsip';
  urutan: number;
}

export const FAQ: React.FC = () => {
  // ----------------------------------------------------
  // State Data FAQ (Dikosongkan untuk diisi dari Backend)
  // ----------------------------------------------------
  // Untuk menghubungkan ke backend, panggil API pada useEffect:
  // useEffect(() => { fetchFaqData(); }, []);
  const [faqList, setFaqList] = useState<FAQItem[]>([]);

  // State Form Input
  const [formData, setFormData] = useState<{
    pertanyaan: string;
    jawaban: string;
    statusVisibilitas: 'Publikasi Langsung' | 'Draft' | 'Arsip';
  }>({
    pertanyaan: '',
    jawaban: '',
    statusVisibilitas: 'Publikasi Langsung',
  });

  // Mode Edit (Menyimpan ID jika sedang mengedit FAQ yang ada)
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // State Pencarian & Paginasi
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Active Menu Sidebar
  const [activeMenu, setActiveMenu] = useState('faq');

  // ----------------------------------------------------
  // Handler Form (Tambah / Simpan & Reset)
  // ----------------------------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      pertanyaan: '',
      jawaban: '',
      statusVisibilitas: 'Publikasi Langsung',
    });
    setEditingId(null);
  };

  const handleSaveFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pertanyaan.trim() || !formData.jawaban.trim()) {
      alert('Harap lengkapi Pertanyaan dan Jawaban FAQ!');
      return;
    }

    if (editingId !== null) {
      // Update data yang sedang diedit (Kirim PUT/PATCH ke Backend di sini)
      setFaqList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                pertanyaan: formData.pertanyaan,
                jawaban: formData.jawaban,
                statusVisibilitas: formData.statusVisibilitas,
              }
            : item
        )
      );
      alert('FAQ berhasil diperbarui!');
    } else {
      // Tambah item baru (Kirim POST ke Backend di sini)
      const newItem: FAQItem = {
        id: Date.now(),
        pertanyaan: formData.pertanyaan,
        jawaban: formData.jawaban,
        statusVisibilitas: formData.statusVisibilitas,
        urutan: faqList.length + 1,
      };
      setFaqList((prev) => [newItem, ...prev]);
      alert('FAQ baru berhasil disimpan!');
    }

    handleReset();
  };

  // ----------------------------------------------------
  // Handler Aksi Tabel (Edit & Hapus)
  // ----------------------------------------------------
  const handleEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setFormData({
      pertanyaan: item.pertanyaan,
      jawaban: item.jawaban,
      statusVisibilitas: item.statusVisibilitas,
    });
    // Scroll ke atas formulir
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      // Panggil DELETE API backend di sini
      setFaqList((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        handleReset();
      }
    }
  };

  // ----------------------------------------------------
  // Filter & Pagination Logic
  // ----------------------------------------------------
  const filteredList = useMemo(() => {
    return faqList.filter((item) =>
      item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [faqList, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#0a2540] text-slate-300 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="leading-tight">
              <h2 className="text-white font-bold text-sm tracking-wide">PTSA KEMNAKER</h2>
              <p className="text-[11px] text-slate-400 font-medium tracking-wider">
                PELAYANAN TERPADU
              </p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Avatar Zuan"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/40"
            />
            <div>
              <p className="text-sm font-semibold text-white">Zuan</p>
              <p className="text-xs text-slate-400">Petugas Pelayanan</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveMenu('beranda')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'beranda'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Home size={18} />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveMenu('pelayanan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'pelayanan'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers size={18} />
              <span>Pelayanan</span>
            </button>

            <button
              onClick={() => setActiveMenu('pengaduan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'pengaduan'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <AlertCircle size={18} />
              <span>Report Pengaduan</span>
            </button>

            <button
              onClick={() => setActiveMenu('survei')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'survei'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText size={18} />
              <span>Report Survei</span>
            </button>

            <button
              onClick={() => setActiveMenu('grafik')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'grafik'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp size={18} />
              <span>Grafik & Statistik</span>
            </button>

            <button
              onClick={() => setActiveMenu('pengaturan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'pengaturan'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings size={18} />
              <span>Pengaturan</span>
            </button>

            <button
              onClick={() => setActiveMenu('faq')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeMenu === 'faq'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle size={18} />
              <span>FAQ</span>
            </button>
          </nav>
        </div>

        {/* Tombol Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => alert('Anda telah keluar dari sistem.')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search Bar (Ctrl+K)"
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button
            onClick={() => alert('Tidak ada notifikasi baru.')}
            className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Bell size={19} />
          </button>
        </header>

        {/* Main Body */}
        <main className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-slate-800">Manajemen FAQ</h1>

          {/* FORM TAMBAH / EDIT FAQ */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingId !== null ? 'Formulir Edit FAQ' : 'Formulir Tambah FAQ'}
              </h2>
            </div>

            <form onSubmit={handleSaveFAQ} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pertanyaan FAQ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pertanyaan"
                    value={formData.pertanyaan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Siapa saja yang berhak menyampaikan aduan ketenagakerjaan?"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Status Visibilitas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="statusVisibilitas"
                    value={formData.statusVisibilitas}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
                  >
                    <option value="Publikasi Langsung">Publikasi Langsung</option>
                    <option value="Draft">Draft</option>
                    <option value="Arsip">Arsip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jawaban Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="jawaban"
                  rows={4}
                  value={formData.jawaban}
                  onChange={handleInputChange}
                  placeholder="Tuliskan jawaban"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Action Bar Formulir */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={16} className="text-teal-600" />
                  <span>Tersinkronisasi otomatis dengan portal publik Kemnaker.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-medium text-white bg-[#0a2540] hover:bg-[#071c31] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Check size={14} />
                    <span>{editingId !== null ? 'Perbarui FAQ' : 'Simpan FAQ'}</span>
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* TABEL DAFTAR FAQ */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter Search */}
            <div className="p-5 border-b border-slate-100">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari pertanyaan"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-center w-16">
                      NO
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      PERTANYAAN FAQ
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center w-28">
                      URUTAN
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center w-28">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        {searchQuery
                          ? 'Tidak ditemukan FAQ yang sesuai dengan pencarian.'
                          : 'Belum ada data FAQ. Data akan dimuat dari Backend.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map((faq, index) => (
                      <tr key={faq.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 text-center text-slate-500 font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <p className="font-semibold text-slate-800 text-sm">{faq.pertanyaan}</p>
                          <p className="text-slate-500 text-xs line-clamp-1">{faq.jawaban}</p>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-slate-700">
                          #{faq.urutan}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(faq)}
                              title="Edit Pertanyaan"
                              className="p-1.5 text-slate-500 hover:text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(faq.id)}
                              title="Hapus Pertanyaan"
                              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-3 text-xs text-slate-500">
              <div>
                Menampilkan{' '}
                <span className="font-semibold text-slate-700">
                  {filteredList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredList.length)}
                </span>{' '}
                dari <span className="font-semibold text-slate-700">{filteredList.length}</span> FAQ
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#0a2540] text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
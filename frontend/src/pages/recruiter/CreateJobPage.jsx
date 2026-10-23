import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateJob } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import {
  Briefcase,
  Building,
  MapPin,
  Banknote,
  FileText,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

export const CreateJobPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const createMutation = useCreateJob();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Judul lowongan wajib diisi.';
    if (!formData.company.trim()) errors.company = 'Nama perusahaan wajib diisi.';
    if (!formData.location.trim()) errors.location = 'Lokasi wajib diisi.';
    if (!formData.description.trim()) errors.description = 'Deskripsi pekerjaan wajib diisi.';

    if (
      formData.salary_min &&
      formData.salary_max &&
      Number(formData.salary_min) > Number(formData.salary_max)
    ) {
      errors.salary_min = 'Gaji minimum tidak boleh lebih besar dari gaji maksimum.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      type: formData.type,
      description: formData.description.trim(),
      requirements: formData.requirements.trim() || null,
      salary_min: formData.salary_min ? Number(formData.salary_min) : null,
      salary_max: formData.salary_max ? Number(formData.salary_max) : null,
    };

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        showSuccess(res?.message || 'Lowongan pekerjaan berhasil dibuat dan dipublikasikan!');
        navigate('/dashboard');
      },
      onError: (err) => {
        const msg = err.response?.data?.message || 'Gagal membuat lowongan pekerjaan.';
        showError(msg);
      },
    });
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <PlusCircle className="w-4 h-4" />
              <span>Publikasi Karir</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Pasang Lowongan Pekerjaan Baru
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Isi informasi pekerjaan secara lengkap agar dapat menarik kandidat terbaik.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Judul Posisi Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                <Briefcase className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Contoh: Senior Frontend Developer, HR Manager, UI/UX Designer"
                  className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                />
              </div>
              {formErrors.title && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.title}</p>
              )}
            </div>

            {/* Company & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nama Perusahaan <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                  <Building className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Contoh: PT Solusi Digital"
                    className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                  />
                </div>
                {formErrors.company && (
                  <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Lokasi Kerja <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Contoh: Jakarta Selatan, Remote, Bandung"
                    className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                  />
                </div>
                {formErrors.location && (
                  <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.location}</p>
                )}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tipe Kontrak Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {JOB_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: value }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.type === value
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs ring-2 ring-orange-500/20'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Gaji Minimum (IDR) <span className="text-stone-400 font-normal">(Opsional)</span>
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    placeholder="Contoh: 8000000"
                    className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                  />
                </div>
                {formErrors.salary_min && (
                  <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.salary_min}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Gaji Maksimum (IDR) <span className="text-stone-400 font-normal">(Opsional)</span>
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    placeholder="Contoh: 15000000"
                    className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Deskripsi Pekerjaan & Tanggung Jawab <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tuliskan gambaran umum pekerjaan, tanggung jawab harian, lingkungan tim, dan tujuan posisi ini..."
                className="w-full p-3.5 bg-[#FAF6F0] rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all resize-y"
              />
              {formErrors.description && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.description}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Kualifikasi & Persyaratan <span className="text-stone-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                name="requirements"
                rows={5}
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Contoh: Pengalaman minimal 2 tahun, menguasai React dan JavaScript, memiliki komunikasi yang baik..."
                className="w-full p-3.5 bg-[#FAF6F0] rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all resize-y"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mempublikasikan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publikasikan Lowongan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

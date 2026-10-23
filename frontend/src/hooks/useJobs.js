import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

/**
 * Custom hook untuk mengambil daftar lowongan kerja dengan filter, pencarian, sort, dan pagination
 */
export const useJobs = (params = {}) => {
  const query = useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const cleanParams = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val;
        }
      });
      const res = await api.get('/jobs', { params: cleanParams });
      return res.data;
    },
    staleTime: 1000 * 60, // 1 menit cache
  });

  return {
    ...query,
    jobs: query.data?.jobs || [],
    pagination: query.data?.pagination || {
      page: 1,
      limit: 9,
      total_items: 0,
      total_pages: 1,
    },
  };
};

/**
 * Custom hook untuk mengambil detail satu lowongan berdasarkan ID
 */
export const useJobDetail = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

/**
 * Custom hook untuk mengambil lowongan milik recruiter yang sedang login
 */
export const useMyJobs = () => {
  const query = useQuery({
    queryKey: ['myJobs'],
    queryFn: async () => {
      const res = await api.get('/jobs/mine');
      return res.data;
    },
  });

  return {
    ...query,
    jobs: query.data || [],
  };
};

/**
 * Custom hook mutasi untuk membuat lowongan baru
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData) => {
      const res = await api.post('/jobs', jobData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
  });
};

/**
 * Custom hook mutasi untuk memperbarui lowongan
 */
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...jobData }) => {
      const res = await api.put(`/jobs/${id}`, jobData);
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
  });
};

/**
 * Custom hook mutasi untuk menghapus lowongan
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/jobs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
  });
};

export default useJobs;

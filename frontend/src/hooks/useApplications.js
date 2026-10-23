import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

/**
 * Custom hook untuk mengambil riwayat lamaran pencari kerja (Job Seeker)
 */
export const useMyApplications = () => {
  const query = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const res = await api.get('/applications/mine');
      return res.data;
    },
  });

  return {
    ...query,
    applications: query.data || [],
  };
};

/**
 * Custom hook untuk mengambil daftar pelamar pada satu lowongan pekerjaan (Recruiter)
 */
export const useJobApplicants = (jobId) => {
  const query = useQuery({
    queryKey: ['jobApplicants', jobId],
    queryFn: async () => {
      const res = await api.get(`/jobs/${jobId}/applicants`);
      return res.data;
    },
    enabled: !!jobId,
  });

  return {
    ...query,
    applicants: query.data || [],
  };
};

/**
 * Custom hook mutasi untuk melamar suatu pekerjaan (Job Seeker)
 */
export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, cover_letter }) => {
      const res = await api.post(`/jobs/${jobId}/apply`, { cover_letter });
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['job', vars.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

/**
 * Custom hook mutasi untuk mengubah status lamaran (Recruiter)
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status, jobId }) => {
      const res = await api.put(`/applications/${applicationId}`, { status });
      return { data: res.data, jobId };
    },
    onSuccess: (_, vars) => {
      if (vars.jobId) {
        queryClient.invalidateQueries({ queryKey: ['jobApplicants', vars.jobId] });
      }
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
};

export const useApplications = () => {
  return {
    useMyApplications,
    useJobApplicants,
    useApplyJob,
    useUpdateApplicationStatus,
  };
};

export default useApplications;

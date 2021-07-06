import { useQuery } from 'react-query'
import {
  fetchAllCurrentUserTpJobseekerCv,
  fetchCurrentUserTpJobseekerCvById,
} from '../services/api/api'

interface Props {
  retry: boolean
}

export function useTpJobseekerCvQuery(props?: Props) {
  const retry = props?.retry ?? true

  return useQuery(
    'allCurrentUserTpJobseekerCv',
    fetchAllCurrentUserTpJobseekerCv,
    {
      staleTime: 5 * 60 * 1000,
      retry,
      refetchOnWindowFocus: false,
    }
  )
}

export function useTpJobseekerCvByIdQuery(id: string, props?: Props) {
  const retry = props?.retry ?? true

  return useQuery(
    'allCurrentUserTpJobseekerCvById',
    () => fetchCurrentUserTpJobseekerCvById(id),
    {
      staleTime: 5 * 60 * 1000,
      retry,
      refetchOnWindowFocus: false,
    }
  )
}
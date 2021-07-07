import React from 'react'
import { useTpCompanyProfileQuery } from '../../../react-query/use-tpcompanyprofile-query'
import { useTpJobseekerProfileQuery } from '../../../react-query/use-tpjobseekerprofile-query'
import { BrowseCompany } from './BrowseCompany'
import { BrowseJobseeker } from './BrowseJobseeker'

function Browse() {
  const { data: jobseekerProfile } = useTpJobseekerProfileQuery({
    retry: false,
  })
  const { data: companyProfile } = useTpCompanyProfileQuery({ retry: false })

  if (jobseekerProfile) return <BrowseJobseeker />
  if (companyProfile) return <BrowseCompany />

  console.log('t')
  return null
}

export default Browse
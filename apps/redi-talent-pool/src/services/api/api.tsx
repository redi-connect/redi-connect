import { API_URL } from '@talent-connect/shared-config'
import {
  AccessToken,
  RedUser,
  TpCompanyProfile,
  TpJobseekerCv,
  TpJobListing,
  TpJobseekerProfile,
} from '@talent-connect/shared-types'
import axios from 'axios'
import { QueryClient } from 'react-query'
import {
  getAccessTokenFromLocalStorage,
  purgeAllSessionData,
  saveAccessTokenToLocalStorage,
  saveRedUserToLocalStorage,
} from '../auth/auth'
import { history } from '../history/history'
import { http } from '../http/http'

export const queryClient = new QueryClient()

export const signUpJobseeker = async (
  email: string,
  password: string,
  tpJobseekerProfile: Partial<TpJobseekerProfile>
) => {
  email = email.toLowerCase()
  const userResponse = await http(`${API_URL}/redUsers`, {
    method: 'post',
    data: { email, password },
  })
  const user = userResponse.data as RedUser
  saveRedUserToLocalStorage(user)
  const accessToken = await login(email, password)
  saveAccessTokenToLocalStorage(accessToken)
  const createProfileResponse = await http(
    `${API_URL}/redUsers/${user.id}/tpJobseekerProfile`,
    {
      method: 'post',
      data: tpJobseekerProfile,
      headers: {
        Authorization: accessToken.id,
      },
    }
  )
}

export const signUpCompany = async (
  email: string,
  password: string,
  tpCompanyProfile: Partial<TpCompanyProfile>
) => {
  email = email.toLowerCase()
  const userResponse = await http(`${API_URL}/redUsers`, {
    method: 'post',
    data: { email, password },
  })
  const user = userResponse.data as RedUser
  saveRedUserToLocalStorage(user)
  const accessToken = await login(email, password)
  saveAccessTokenToLocalStorage(accessToken)
  const createProfileResponse = await http(
    `${API_URL}/redUsers/${user.id}/tpCompanyProfile`,
    {
      method: 'post',
      data: tpCompanyProfile,
      headers: {
        Authorization: accessToken.id,
      },
    }
  )
}

export const login = async (
  email: string,
  password: string
): Promise<AccessToken> => {
  email = email.toLowerCase()
  const loginResp = await http(`${API_URL}/redUsers/login`, {
    method: 'post',
    data: { email, password },
    headers: {
      RedProduct: 'TP',
    },
  })
  const accessToken = loginResp.data as AccessToken
  return accessToken
}

export const logout = () => {
  purgeAllSessionData()
  history.push('/front/home')
}

export const requestResetPasswordEmail = async (email: string) => {
  await axios(`${API_URL}/redUsers/requestResetPasswordEmail`, {
    method: 'post',
    data: { email, redproduct: 'TP' },
  })
}

export const setPassword = async (password: string) => {
  const userId = getAccessTokenFromLocalStorage().userId
  await http(`${API_URL}/redUsers/${userId}`, {
    method: 'patch',
    data: { password },
  })
}

export interface TpJobseekerProfileFilters {
  name: string
  skills: string[]
  desiredPositions: string[]
  isJobFair2022Participant: boolean
}

export async function fetchAllTpJobseekerProfiles({
  name,
  skills: topSkills,
  desiredPositions,
  isJobFair2022Participant,
}: TpJobseekerProfileFilters): Promise<Array<Partial<TpJobseekerProfile>>> {
  const filterTopSkills =
    topSkills && topSkills.length !== 0 ? { inq: topSkills } : undefined
  const filterDesiredPositions =
    desiredPositions && desiredPositions.length !== 0
      ? { inq: desiredPositions }
      : undefined
  const filterJobFair2022Participant = isJobFair2022Participant
    ? { isJobFair2022Participant: true }
    : undefined

  return http(
    `${API_URL}/tpJobseekerProfiles?filter=${JSON.stringify({
      where: {
        // loopbackComputedDoNotSetElsewhere__forAdminSearch__fullName: {
        //   like: 'Carlotta3',
        //   options: 'i',
        // },
        and: [
          ...String(name)
            .split(' ')
            .map((word) => ({
              loopbackComputedDoNotSetElsewhere__forAdminSearch__fullName: {
                like: word,
                options: 'i',
              },
            })),
          { topSkills: filterTopSkills },
          { desiredPositions: filterDesiredPositions },
          { ...filterJobFair2022Participant },
        ],
      },
      order: 'createdAt DESC',
      limit: 0,
    })}`
  ).then((resp) =>
    resp.data.filter(
      (p) => p.isProfileVisibleToCompanies && p.state === 'profile-approved'
    )
  )
}

export async function fetchCurrentUserTpJobseekerProfile(): Promise<
  Partial<TpJobseekerProfile>
> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobseekerProfile`)
  return resp.data
}

export async function updateCurrentUserTpJobseekerProfile(
  profile: Partial<TpJobseekerProfile>
): Promise<Partial<TpJobseekerProfile>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobseekerProfile`, {
    method: 'put',
    data: profile,
  })
  return resp.data
}

export async function fetchAllCurrentUserTpJobseekerCv(): Promise<
  Array<Partial<TpJobseekerCv>>
> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobseekerCv`)
  return resp.data
}

export async function fetchCurrentUserTpJobseekerCvById(
  id: string
): Promise<Partial<TpJobseekerCv>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobseekerCv/${id}`)
  return resp.data
}

export function createCurrentUserTpJobseekerCv() {
  return async function (
    data: Partial<TpJobseekerCv>
  ): Promise<Partial<TpJobseekerCv>> {
    const userId = getAccessTokenFromLocalStorage().userId
    const resp = await http(`${API_URL}/redUsers/${userId}/tpJobseekerCv`, {
      method: 'post',
      data,
    })
    return resp.data
  }
}

export function updateCurrentUserTpJobseekerCv(id: string) {
  return async function (
    data: Partial<TpJobseekerCv>
  ): Promise<Partial<TpJobseekerCv>> {
    const userId = getAccessTokenFromLocalStorage().userId
    const resp = await http(
      `${API_URL}/redUsers/${userId}/tpJobseekerCv/${id}`,
      { method: 'put', data }
    )
    return resp.data
  }
}

export function deleteCurrentUserTpJobseekerCv(id: string) {
  return async function () {
    const userId = getAccessTokenFromLocalStorage().userId
    const resp = await http(
      `${API_URL}/redUsers/${userId}/tpJobseekerCv/${id}`,
      { method: 'delete' }
    )
    return resp.data
  }
}

export async function fetchCurrentUserTpCompanyProfile(): Promise<
  Partial<TpCompanyProfile>
> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpCompanyProfile`)
  return resp.data
}

export async function updateCurrentUserTpCompanyProfile(
  profile: Partial<TpCompanyProfile>
): Promise<Partial<TpCompanyProfile>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpCompanyProfile`, {
    method: 'put',
    data: profile,
  })
  return resp.data
}

export interface TpJobListingFilters {
  idealTechnicalSkills: string[]
  employmentType: string[]
  isJobFair2022JobListing: boolean
}

export async function fetchAllTpJobListingsUsingFilters({
  idealTechnicalSkills,
  employmentType,
  isJobFair2022JobListing,
}: TpJobListingFilters): Promise<Array<Partial<TpJobseekerProfile>>> {
  const filterIdealTechnicalSkills =
    idealTechnicalSkills && idealTechnicalSkills.length !== 0
      ? { inq: idealTechnicalSkills }
      : undefined

  const filterDesiredEmploymentTypeOptions =
    employmentType && employmentType.length !== 0
      ? { inq: employmentType }
      : undefined

  const filterJobFair2022JobListings = isJobFair2022JobListing
    ? { isJobFair2022JobListing: true }
    : undefined

  return http(
    `${API_URL}/tpJobListings?filter=${JSON.stringify({
      where: {
        // loopbackComputedDoNotSetElsewhere__forAdminSearch__fullName: {
        //   like: 'Carlotta3',
        //   options: 'i',
        // },
        and: [
          {
            idealTechnicalSkills: filterIdealTechnicalSkills,
            employmentType: filterDesiredEmploymentTypeOptions,
            ...filterJobFair2022JobListings,
          },
        ],
      },
      order: 'createdAt DESC',
      limit: 0,
    })}`
  ).then((resp) =>
    resp.data
      .filter((listing) => !listing.dummy)
      .filter(
        (listing) => listing.tpCompanyProfile?.isProfileVisibleToJobseekers
      )
  )
}

export async function fetchAllTpJobListings(): Promise<Array<TpJobListing>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobListings`)

  // TODO: remove the `.filter()`. It
  // was inserted temporarily for the "dummy" job listings we created for HR Summit
  // 2021. Once the event is over, they can be removed from database completely.
  // Reason for filter here is so companies don't see these dummy job listings.
  return resp.data.filter((listing) => !listing.dummy)
}

export async function fetchOneTpJobListingOfCurrentUser(
  id: string
): Promise<TpJobListing> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobListings/${id}`)
  return resp.data
}

export async function fetchOneTpJobListing(id: string): Promise<TpJobListing> {
  const resp = await http(`${API_URL}/tpJobListings/${id}`)
  return resp.data
}

export async function createCurrentUserTpJobListing(
  jobListing: Partial<TpJobListing>
): Promise<Partial<TpJobListing>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(`${API_URL}/redUsers/${userId}/tpJobListings`, {
    method: 'post',
    data: jobListing,
  })
  return resp.data
}

export async function updateCurrentUserTpJobListing(
  jobListing: Partial<TpJobListing>
): Promise<Partial<TpJobListing>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(
    `${API_URL}/redUsers/${userId}/tpJobListings/${jobListing.id}`,
    {
      method: 'put',
      data: jobListing,
    }
  )
  return resp.data
}

export async function deleteCurrentUserTpJobListing(
  jobListingId: string
): Promise<Partial<TpJobListing>> {
  const userId = getAccessTokenFromLocalStorage().userId
  const resp = await http(
    `${API_URL}/redUsers/${userId}/tpJobListings/${jobListingId}`,
    {
      method: 'delete',
    }
  )
  return resp.data
}

export async function fetchAllTpJobFair2021InterviewMatches_tpJobListings(): Promise<
  Array<TpJobListing>
> {
  const resp = await http(`${API_URL}/tpJobfair2021InterviewMatches`)
  const interviewMatches = resp.data
  const jobListings: Array<TpJobListing> = interviewMatches.map(
    (match) => match.jobListing
  )

  return jobListings
}

export async function fetchAllTpJobFair2021InterviewMatches_tpJobseekerProfiles(): Promise<
  Array<TpJobseekerProfile>
> {
  const resp = await http(`${API_URL}/tpJobfair2021InterviewMatches`)
  const interviewMatches = resp.data
  const jobseekerProfiles: Array<TpJobseekerProfile> = interviewMatches.map(
    (match) => match.interviewee
  )

  return jobseekerProfiles
}

export async function fetchTpJobseekerProfileById(
  id: string
): Promise<Partial<TpJobseekerProfile>> {
  const resp = await http(`${API_URL}/tpJobseekerProfiles/${id}`)
  return resp.data
}

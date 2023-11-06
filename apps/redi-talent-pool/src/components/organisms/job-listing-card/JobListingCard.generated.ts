// THIS FILE IS GENERATED, DO NOT EDIT!
import * as Types from '@talent-connect/data-access';

export type JobListingCardJobListingPropFragment = { __typename?: 'TpJobListing', id: string, title?: string | null, idealTechnicalSkills?: Array<Types.TpTechnicalSkill> | null, companyName: string, profileAvatarImageS3Key?: string | null, status?: Types.TpJobListingStatus | null, createdAt: any, federalState?: Types.FederalState | null, location?: string | null, isRemotePossible?: boolean | null };

export const JobListingCardJobListingPropFragmentDoc = `
    fragment JobListingCardJobListingProp on TpJobListing {
  id
  title
  idealTechnicalSkills
  companyName
  profileAvatarImageS3Key
  status
  createdAt
  federalState
  location
  isRemotePossible
}
    `;
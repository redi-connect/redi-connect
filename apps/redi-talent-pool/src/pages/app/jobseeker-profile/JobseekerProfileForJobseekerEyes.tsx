import { Tooltip } from '@mui/material'
import {
  JobseekerProfileStatus,
  TpJobseekerDirectoryEntry,
  useMyTpDataQuery,
  useTpJobseekerProfilePatchMutation,
} from '@talent-connect/data-access'
import {
  Button,
  Checkbox,
  Icon,
} from '@talent-connect/shared-atomic-design-components'
import classnames from 'clsx'
import { Columns, Content, Element, Notification } from 'react-bulma-components'
import { useQueryClient } from 'react-query'
import { ReactComponent as ChecklistActiveImage } from '../../../assets/checklist-item-active.svg'
import { ReactComponent as ChecklistImage } from '../../../assets/checklist-item.svg'
import { ReactComponent as CheckmarkBorderOnlyImage } from '../../../assets/checkmark-border-only.svg'
import { ReactComponent as CheckmarkImage } from '../../../assets/checkmark.svg'
import { ReactComponent as StepPendingImage } from '../../../assets/pending.svg'
import { EditableEducation } from '../../../components/organisms/jobseeker-profile-editables/EditableEducation'
import { EditableImportantDetails } from '../../../components/organisms/jobseeker-profile-editables/EditableImportantDetails'
import { EditableLanguages } from '../../../components/organisms/jobseeker-profile-editables/EditableLanguages'
import { EditableLinks } from '../../../components/organisms/jobseeker-profile-editables/EditableLinks'
import { EditableNamePhotoLocation } from '../../../components/organisms/jobseeker-profile-editables/EditableNamePhotoLocation'
import { EditableOverview } from '../../../components/organisms/jobseeker-profile-editables/EditableOverview'
import { EditableProfessionalExperience } from '../../../components/organisms/jobseeker-profile-editables/EditableProfessionalExperience'
import { EditableSummary } from '../../../components/organisms/jobseeker-profile-editables/EditableSummary'
import { LoggedIn } from '../../../components/templates'
import './JobseekerProfileForJobseekerEyes.scss'

export function JobseekerProfileForJobseekerEyes() {
  const queryClient = useQueryClient()
  const myData = useMyTpDataQuery()
  const profile = myData?.data?.tpCurrentUserDataGet?.tpJobseekerDirectoryEntry

  const mutation = useTpJobseekerProfilePatchMutation()

  const onHideFromCompaniesCheckboxChange = async () => {
    await mutation.mutateAsync({
      input: {
        isProfileVisibleToCompanies: !profile?.isProfileVisibleToCompanies,
      },
    })
    queryClient.invalidateQueries()
  }

  // Hidden until the new date announced
  // const onMunich24SummerJobFairParticipateChange = async () => {
  //   await mutation.mutateAsync({
  //     input: {
  //       joinsMunich24SummerJobFair: !profile?.joinsMunich24SummerJobFair,
  //     },
  //   })
  //   queryClient.invalidateQueries()
  // }

  const isProfileApproved =
    profile?.state === JobseekerProfileStatus.ProfileApproved

  const isProfileSubmittedForReview =
    profile?.state === JobseekerProfileStatus.SubmittedForReview

  return (
    <LoggedIn>
      {isProfileApproved ? (
        <Notification className="account-not-active double-bs">
          <Icon
            className="account-not-active__icon"
            icon="search"
            size="large"
            space="right"
          />
          <Content size="small">
            <strong>Great, your profile is approved!</strong> You can now{' '}
            <a href="/app/browse">browse open job postings</a>!
          </Content>
        </Notification>
      ) : null}
      <Columns className="is-6 is-variable">
        <Columns.Column mobile={{ size: 12 }} tablet={{ size: 'three-fifths' }}>
          <div className="is-hidden-tablet">
            {isProfileSubmittedForReview ? null : (
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <CallToActionButton profile={profile} />
              </div>
            )}
            {!isProfileApproved && <OnboardingSteps />}
          </div>
          <EditableNamePhotoLocation profile={profile} />
          <div style={{ marginBottom: '1.5rem' }}>
            {/* Hidden until the next Job Fair date announced */}
            {/* <Checkbox
              checked={profile?.joinsMunich24SummerJobFair}
              customOnChange={onMunich24SummerJobFairParticipateChange}
            >
              I will attend the <b>ReDI Winter Job Fair in Munich</b> on{' '}
              <b>22/02/2024</b>.
            </Checkbox> */}
          </div>
          <EditableOverview profile={profile} />
          <EditableSummary profile={profile} />
          <EditableProfessionalExperience profile={profile} />
          <EditableEducation profile={profile} />
        </Columns.Column>
        <Columns.Column mobile={{ size: 12 }} tablet={{ size: 'two-fifths' }}>
          <div className="is-hidden-mobile">
            {isProfileSubmittedForReview ? null : (
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <CallToActionButton profile={profile} />
              </div>
            )}
            {!isProfileApproved && <OnboardingSteps />}
          </div>
          {/* <EditableVisibility /> */}
          <EditableImportantDetails profile={profile} showFullAddress />
          <EditableLanguages profile={profile} />
          <EditableLinks profile={profile} />
          <Checkbox
            checked={!profile?.isProfileVisibleToCompanies}
            customOnChange={onHideFromCompaniesCheckboxChange}
          >
            Hide my profile from companies
          </Checkbox>
        </Columns.Column>
      </Columns>
    </LoggedIn>
  )
}

const CallToActionButton = ({
  profile,
}: {
  profile?: Pick<TpJobseekerDirectoryEntry, 'state'>
}) => {
  return profile &&
    profile.state &&
    [
      JobseekerProfileStatus.DraftingProfile,
      JobseekerProfileStatus.SubmittedForReview,
    ].includes(profile.state) ? (
    <SendProfileForReviewButton />
  ) : null
}

const steps = [
  { number: 1, label: 'Complete your profile' },
  { number: 2, label: 'Send profile to ReDI' },
  { number: 3, label: 'Profile approval' },
]

function determineCurrentStep(
  profile: TpJobseekerDirectoryEntry
): [currentStep: number, stepStatus: 'todo' | 'pending' | 'complete'] {
  if (profile?.state === JobseekerProfileStatus.DraftingProfile) {
    return isProfileComplete(profile) ? [2, 'todo'] : [1, 'todo']
  }
  if (profile?.state === JobseekerProfileStatus.SubmittedForReview) {
    return [3, 'pending']
  }
  if (profile?.state === JobseekerProfileStatus.ProfileApproved) {
    return [3, 'complete']
  }

  return [1, 'todo']
}

export function OnboardingSteps() {
  const myData = useMyTpDataQuery()
  const profile = myData?.data?.tpCurrentUserDataGet?.tpJobseekerDirectoryEntry

  const currentStep = determineCurrentStep(profile)

  return (
    <div className="onboarding-steps">
      <div className="onboarding-steps--header">
        <Element
          renderAs="h4"
          textAlignment="centered"
          textTransform="uppercase"
          textSize={6}
        >
          Complete the steps below!
        </Element>
      </div>
      {steps.map((step, index) => (
        <div
          key={index}
          className={classnames('onboarding-steps--item', {
            'current-step': step.number === currentStep[0],
            'completed-step': step.number < currentStep[0],
          })}
        >
          {step.number < currentStep[0] ? (
            <ChecklistActiveImage className="checklist-image" />
          ) : (
            <ChecklistImage className="checklist-image" />
          )}
          <Element textSize={5}>{step.label}</Element>
          {currentStep[0] > step.number ? (
            <CheckmarkImage className="checkmark-image" />
          ) : null}
          {currentStep[0] < step.number ? (
            <CheckmarkBorderOnlyImage className="checkmark-image" />
          ) : null}
          {currentStep[0] === step.number && currentStep[1] === 'todo' ? (
            <CheckmarkBorderOnlyImage className="checkmark-image" />
          ) : null}
          {currentStep[0] === step.number && currentStep[1] === 'pending' ? (
            <StepPendingImage className="checkmark-image" />
          ) : null}
          {currentStep[0] === step.number && currentStep[1] === 'complete' ? (
            <CheckmarkImage className="checkmark-image" />
          ) : null}
        </div>
      ))}
    </div>
  )
}

function isProfileComplete(profile: TpJobseekerDirectoryEntry): boolean {
  const mostSectionsComplete = [
    EditableNamePhotoLocation.isSectionFilled,
    EditableOverview.isSectionFilled,
    EditableSummary.isSectionFilled,
    EditableImportantDetails.isSectionFilled,
    EditableLanguages.isSectionFilled,
  ]
    .map((checkerFn) => checkerFn(profile))
    .every((p) => p)
  const experienceOrEducationSectionComplete =
    EditableProfessionalExperience.isSectionFilled(profile) ||
    EditableEducation.isSectionFilled(profile)

  return mostSectionsComplete && experienceOrEducationSectionComplete
}

function SendProfileForReviewButton() {
  const queryClient = useQueryClient()
  const myData = useMyTpDataQuery()
  const profile = myData.data?.tpCurrentUserDataGet?.tpJobseekerDirectoryEntry
  const mutation = useTpJobseekerProfilePatchMutation()

  const enabled =
    profile?.state === JobseekerProfileStatus.DraftingProfile &&
    isProfileComplete(profile)

  const onClick = async () => {
    if (!window.confirm('Would you like to submit your profile for review?'))
      return

    await mutation.mutateAsync({
      input: { state: JobseekerProfileStatus.SubmittedForReview },
    })
    queryClient.invalidateQueries()
  }

  if (enabled) {
    return <Button onClick={onClick}>Send profile to review</Button>
  } else {
    return (
      <Tooltip title="You need to complete your profile before you can send it for review">
        <span>
          <Button disabled style={{ pointerEvents: 'none' }}>
            Send profile to review
          </Button>
        </span>
      </Tooltip>
    )
  }
}

import {
  Button,
  FormTextArea,
  Modal,
} from '@talent-connect/shared-atomic-design-components'
import { useFormik } from 'formik'
import { useState } from 'react'
import { Content } from 'react-bulma-components'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import {
  ConfirmMentorshipMatchPropFragment,
  useAcceptMentorshipMutation,
} from './ConfirmMentorship.generated'

interface ConfirmMentorshipProps {
  match: ConfirmMentorshipMatchPropFragment
  menteeName?: string
  hasReachedMenteeLimit?: boolean
}

interface ConfirmMentorshipFormValues {
  mentorReplyMessageOnAccept: string
}

const initialValues = {
  mentorReplyMessageOnAccept: '',
}

const MIN_CHARS_COUNT = 250
const MAX_CHARS_COUNT = 600

const validationSchema = Yup.object({
  mentorReplyMessageOnAccept: Yup.string()
    .required()
    .min(MIN_CHARS_COUNT)
    .max(MAX_CHARS_COUNT),
})

const ConfirmMentorship = ({
  match,
  hasReachedMenteeLimit,
}: ConfirmMentorshipProps) => {
  const queryClient = useQueryClient()
  const acceptMentorshipMutation = useAcceptMentorshipMutation()
  const [isModalActive, setModalActive] = useState(false)
  const history = useHistory()
  const { mentee = { firstName: null } } = match

  const submitForm = async (values: ConfirmMentorshipFormValues) => {
    try {
      await acceptMentorshipMutation.mutateAsync({
        input: {
          mentorReplyMessageOnAccept: values.mentorReplyMessageOnAccept,
          mentorshipMatchId: match.id,
        },
      })
      setModalActive(false)
      history.push(`/app/mentorships/${match.id}`)
      queryClient.invalidateQueries()
    } catch (error) {
      console.log('error ', error)
      // Very crude
      alert('An error occurred. The page will now reload.')
      window.location.reload()
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitForm,
  })

  const isFormSubmittable = formik.dirty && formik.isValid

  return (
    <>
      <Button
        onClick={() => setModalActive(true)}
        disabled={hasReachedMenteeLimit}
      >
        Accept
      </Button>
      <Modal
        show={isModalActive}
        stateFn={setModalActive}
        title="Accept Application"
      >
        <Modal.Body>
          <form>
            <Content>
              <p>
                Please write a few welcoming words to your future mentee and
                give some information on your first meeting (250-600
                characters).
              </p>
            </Content>
            <FormTextArea
              name="mentorReplyMessageOnAccept"
              rows={4}
              placeholder={`Dear ${mentee.firstName}...`}
              minChar={MIN_CHARS_COUNT}
              maxLength={MAX_CHARS_COUNT}
              formik={formik}
            />
          </form>
        </Modal.Body>

        <Modal.Foot>
          <Button
            disabled={!isFormSubmittable}
            onClick={() => formik.handleSubmit()}
          >
            Accept mentorship request
          </Button>
        </Modal.Foot>
      </Modal>
    </>
  )
}

export default ConfirmMentorship

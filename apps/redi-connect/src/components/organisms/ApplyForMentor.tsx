import {
  Caption,
  FormTextArea,
  Checkbox,
  Button,
} from '@talent-connect/shared-atomic-design-components'
import { Modal } from '@talent-connect/shared-atomic-design-components'
import { Content, Form } from 'react-bulma-components'
import { FormSubmitResult, RedProfile } from '@talent-connect/shared-types'

import { FormikHelpers as FormikActions, useFormik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { requestMentorship } from '../../services/api/api'

import { RootState } from '../../redux/types'
import { connect } from 'react-redux'
import { profilesFetchOneStart } from '../../redux/profiles/actions'

interface ConnectionRequestFormValues {
  applicationText: string
  expectationText: string
  dataSharingAccepted: boolean
}

const initialValues = {
  applicationText: '',
  expectationText: '',
  dataSharingAccepted: false,
}

const validationSchema = Yup.object({
  applicationText: Yup.string().required().min(250).max(600),
  expectationText: Yup.string().required().min(250).max(600),
  dataSharingAccepted: Yup.boolean()
    .required()
    .oneOf([true], 'Sharing profile data with your mentor is required'),
})

interface Props {
  mentor: RedProfile
  profilesFetchOneStart: Function
}

const ApplyForMentor = ({ mentor, profilesFetchOneStart }: Props) => {
  const [submitResult, setSubmitResult] =
    useState<FormSubmitResult>('notSubmitted')
  const [show, setShow] = useState(false)
  const submitForm = async (
    values: ConnectionRequestFormValues,
    actions: FormikActions<ConnectionRequestFormValues>
  ) => {
    setSubmitResult('submitting')
    try {
      await requestMentorship(
        values.applicationText,
        values.expectationText,
        mentor.id
      )
      setShow(false)
      profilesFetchOneStart(mentor.id)
    } catch (error) {
      setSubmitResult('error')
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: submitForm,
  })

  const handleCancel = () => {
    setShow(false)
    formik.resetForm()
  }

  return (
    <>
      <Button onClick={() => setShow(true)}>Apply for this mentor</Button>
      <Modal
        show={show}
        stateFn={setShow}
        title={`Application to ${mentor.firstName} ${mentor.lastName}`}
      >
        <Modal.Body>
          <form>
            {submitResult === 'success' && (
              <>Your application was successfully submitted.</>
            )}
            {submitResult !== 'success' && (
              <>
                <Content>
                  <p>
                    Want to apply to {mentor.firstName} {mentor.lastName}?
                    Great! Next step is to write about your Motivation and
                    Expectation below.
                  </p>
                </Content>
                <Caption>Motivation </Caption>
                <Content size="small">
                  <p>
                    Describe why you think the two of you are a great fit
                    (250-600 characters).
                  </p>
                </Content>
                <FormTextArea
                  name="applicationText"
                  className="oneandhalf-bs"
                  rows={4}
                  placeholder={`Dear ${mentor.firstName}...`}
                  minChar={250}
                  maxChar={600}
                  maxLength={600}
                  formik={formik}
                />

                <Caption>Expectation </Caption>
                <Content size="small">
                  <p>
                    Write a few words about your expectations of the mentorship
                    with {mentor.firstName}.
                  </p>
                </Content>
                <FormTextArea
                  name="expectationText"
                  rows={4}
                  placeholder="My expectations for this mentorship…"
                  minChar={250}
                  maxChar={600}
                  maxLength={600}
                  formik={formik}
                />

                <Form.Help
                  color="danger"
                  className={submitResult === 'error' ? 'help--show' : ''}
                >
                  {submitResult === 'error' &&
                    'An error occurred, please try again.'}
                </Form.Help>

                <Checkbox.Form
                  name="dataSharingAccepted"
                  checked={formik.values.dataSharingAccepted}
                  {...formik}
                >
                  I understand that my profile data will be shared with this
                  mentor
                </Checkbox.Form>
              </>
            )}
          </form>
        </Modal.Body>

        <Modal.Foot>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={!(formik.dirty && formik.isValid)}
          >
            Send application
          </Button>

          <Button onClick={handleCancel} simple>
            Cancel
          </Button>
        </Modal.Foot>
      </Modal>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  mentor: state.profiles.oneProfile as RedProfile,
})

const mapDispatchToProps = (dispatch: any) => ({
  profilesFetchOneStart: (profileId: string) =>
    dispatch(profilesFetchOneStart(profileId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApplyForMentor)

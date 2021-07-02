import { Loader } from '@talent-connect/shared-atomic-design-components'
import React, { ReactNode } from 'react'
import { Columns, Container, Section } from 'react-bulma-components'
import { useIsBusy } from '../../hooks/useIsBusy'
import { useTpCompanyProfileQuery } from '../../react-query/use-tpcompanyprofile-query'
import { useTpJobseekerProfileQuery } from '../../react-query/use-tpjobseekerprofile-query'
import { TpMainNavItem } from '../molecules/TpMainNavItem'
import { Navbar } from '../organisms'
import Footer from '../organisms/Footer'
import './LoggedIn.scss'

interface Props {
  children?: ReactNode
}

const LoggedIn = ({ children }: Props) => {
  const isBusy = useIsBusy()
  const { data: jobseekerProfile } = useTpJobseekerProfileQuery({
    retry: false,
  })
  const { data: companyProfile } = useTpCompanyProfileQuery({ retry: false })

  return (
    <>
      <Navbar />
      <Container className="main-container">
        <div style={{ display: 'flex' }}>
          <div className="tp-side-menu">
            <TpMainNavItem
              page="profile-page"
              pageName="My profile"
              to="/app/me"
              isActive
            />
            <TpMainNavItem
              page="browse-page"
              pageName="Browse"
              to="/app/browse"
              isDisabled
            />
            {jobseekerProfile ? (
              <TpMainNavItem
                page="cv-builder-page"
                pageName="CV Builder"
                to="/app/cv-builder"
                isDisabled
              />
            ) : null}
          </div>
          <div className="main-container--horizontal-spacer"></div>
          <Columns style={{ width: '100%', marginTop: '1rem' }}>
            <Columns.Column
              desktop={{ size: 12 }}
              className="column--main-content"
            >
              <Loader loading={isBusy} />
              {children}
            </Columns.Column>
          </Columns>
          <div className="main-container--horizontal-spacer is-hidden-desktop"></div>
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default LoggedIn

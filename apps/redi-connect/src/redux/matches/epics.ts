import { ActionsObservable, ofType } from 'redux-observable'
import { concat, from, of } from 'rxjs'
import { map, switchMap, tap } from 'rxjs/operators'
import { API_URL } from '@talent-connect/shared-config'
import { http } from '../../services/http/http'
import { profilesFetchOneStart } from '../profiles/actions'
import { profileFetchStart } from '../user/actions'
import {
  matchesAcceptMentorshipSuccess,
  matchesMarkAsComplete,
  matchesFetchStart,
  matchesFetchSuccess,
} from './actions'
import {
  MatchesAcceptMentorshipStartAction,
  MatchesMarkAsDismissedStartAction,
  MatchesActions,
  MatchesActionType,
  MatchesMarkAsCompleteAction,
  MatchesDeclineMentorshipStartAction,
} from './types'

const fetchFilter = {
  include: ['mentee', 'mentor'],
}

export const matchesFetchEpic = (action$: ActionsObservable<MatchesActions>) =>
  action$.pipe(
    ofType(MatchesActionType.MATCHES_FETCH_START),
    switchMap(() =>
      http(`${API_URL}/redMatches?filter=${JSON.stringify(fetchFilter)}`)
    ),
    map((resp) => resp.data),
    map(matchesFetchSuccess)
  )

export const matchesMarkAsDismissed = (
  action$: ActionsObservable<MatchesActions>
) =>
  action$.pipe(
    ofType(MatchesActionType.MATCHES_MARK_AS_DISMISSED_START),
    switchMap((action) =>
      http(`${API_URL}/redMatches/markAsDismissed`, {
        method: 'post',
        data: {
          redMatchId: (action as MatchesMarkAsDismissedStartAction).payload
            .redMatchId,
        },
      })
    ),
    map((resp) => resp.data),
    map(matchesFetchStart)
  )

export const matchesAcceptMentorshipEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(MatchesActionType.MATCHES_ACCEPT_MENTORSHIP_START),
    switchMap((action) => {
      const request = from(
        http(`${API_URL}/redMatches/acceptMentorship`, {
          method: 'post',
          data: {
            redMatchId: (action as MatchesAcceptMentorshipStartAction).payload
              .redMatchId,
            mentorReplyMessageOnAccept: (
              action as MatchesAcceptMentorshipStartAction
            ).payload.mentorReplyMessageOnAccept,
          },
        })
      ).pipe(
        map((resp) => resp.data),
        map(matchesAcceptMentorshipSuccess)
      )

      return request
    }),
    switchMap((successAction: any) => {
      return concat(
        of(successAction),
        of(matchesFetchStart()),
        of(profileFetchStart()),
        // This next one is a terrible idea. It is a hard-dependency coming from <Profile>. Use case:
        // A mentor is looking at a mentee's profile page. The mentee in question has applied (via RedMatch)
        // for mentorship. Mentor clicks the <ConnectButton>, setting off a chain of actions and epics
        // in the matches module, where we are now. The profile page must now refresh, since the mentee's match
        // has changed from .status = applied to .status = accepted. To force a refresh of that page, we must
        // trigger a re-fetch of the underlying date used by the page, i.e. rootState.profiles.oneProfile.
        // Ideally, that page should itself have some kind of logic: on(change of RedMatch status) { reFetch() }
        of(profilesFetchOneStart(successAction.payload.menteeId))
      )
    })

    // TODO: fix this
    // catchError((err as Error) => matchesAcceptMentorshipError(err))
  )

export const matchesDeclineMentorshipEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    tap((p) => console.log('Hello hello', p)),
    ofType(MatchesActionType.MATCHES_DECLINE_MENTORSHIP_START),
    switchMap((action) => {
      const request = from(
        http(`${API_URL}/redMatches/declineMentorship`, {
          method: 'post',
          data: {
            redMatchId: (action as MatchesDeclineMentorshipStartAction).payload
              .redMatchId,
            ifDeclinedByMentor_chosenReasonForDecline: (
              action as MatchesDeclineMentorshipStartAction
            ).payload.ifDeclinedByMentor_chosenReasonForDecline,
            ifDeclinedByMentor_ifReasonIsOther_freeText: (
              action as MatchesDeclineMentorshipStartAction
            ).payload.ifDeclinedByMentor_ifReasonIsOther_freeText,
            ifDeclinedByMentor_optionalMessageToMentee: (
              action as MatchesDeclineMentorshipStartAction
            ).payload.ifDeclinedByMentor_optionalMessageToMentee,
          },
        })
      ).pipe(
        map((resp) => resp.data),
        map(matchesAcceptMentorshipSuccess)
      )

      return request
    }),
    switchMap((successAction: any) => {
      return concat(
        of(successAction),
        of(matchesFetchStart()),
        of(profileFetchStart()),
        // This next one is a terrible idea. It is a hard-dependency coming from <Profile>. Use case:
        // A mentor is looking at a mentee's profile page. The mentee in question has applied (via RedMatch)
        // for mentorship. Mentor clicks the <ConnectButton>, setting off a chain of actions and epics
        // in the matches module, where we are now. The profile page must now refresh, since the mentee's match
        // has changed from .status = applied to .status = accepted. To force a refresh of that page, we must
        // trigger a re-fetch of the underlying date used by the page, i.e. rootState.profiles.oneProfile.
        // Ideally, that page should itself have some kind of logic: on(change of RedMatch status) { reFetch() }
        of(profilesFetchOneStart(successAction.payload.menteeId))
      )
    })

    // TODO: fix this
    // catchError((err as Error) => matchesAcceptMentorshipError(err))
  )

export const matchesMarkAsCompleteEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(MatchesActionType.MATCHES_MARK_AS_COMPLETED),
    switchMap((action) => {
      const request = from(
        http(`${API_URL}/redMatches/markAsCompleted`, {
          method: 'post',
          data: {
            redMatchId: (action as MatchesMarkAsCompleteAction).payload
              .redMatchId,
            mentorMessageOnComplete: (action as MatchesMarkAsCompleteAction)
              .payload.mentorMessageOnComplete,
          },
        })
      ).pipe(
        map((resp) => resp.data),
        map(matchesAcceptMentorshipSuccess)
      )

      return request
    }),
    switchMap((successAction: any) => {
      return concat(
        of(successAction),
        of(matchesFetchStart()),
        of(profileFetchStart()),
        // This next one is a terrible idea. It is a hard-dependency coming from <Profile>. Use case:
        // A mentor is looking at a mentee's profile page. The mentee in question has applied (via RedMatch)
        // for mentorship. Mentor clicks the <ConnectButton>, setting off a chain of actions and epics
        // in the matches module, where we are now. The profile page must now refresh, since the mentee's match
        // has changed from .status = applied to .status = accepted. To force a refresh of that page, we must
        // trigger a re-fetch of the underlying date used by the page, i.e. rootState.profiles.oneProfile.
        // Ideally, that page should itself have some kind of logic: on(change of RedMatch status) { reFetch() }
        of(profilesFetchOneStart(successAction.payload.menteeId))
      )
    })

    // TODO: fix this
    // catchError((err as Error) => matchesAcceptMentorshipError(err))
  )

export const matchesEpics = {
  matchesFetchEpic,
  matchesAcceptMentorshipEpic,
  matchesDeclineMentorshipEpic,
  matchesMarkAsCompleteEpic,
  matchesMarkAsDismissed,
}
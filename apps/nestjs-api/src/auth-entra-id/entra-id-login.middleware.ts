import { AuthorizationUrlRequest, ResponseMode } from '@azure/msal-node'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { EntraIdConfigProvider } from './entra-id-config.provider'
import { EntraIdService } from './entra-id.service'
import { VerificationData } from './verification-data.interface'

@Injectable()
export class EntraIdLoginMiddleware implements NestMiddleware {
  private authorizationUrlRequestParams: AuthorizationUrlRequest

  constructor(
    private readonly idService: EntraIdService,
    private readonly configProvider: EntraIdConfigProvider
  ) {
    this.authorizationUrlRequestParams = this.prepareAuthCodeRequestParams()
  }

  use(_: Request, res: Response, next: NextFunction) {
    this.redirectToAuthCodeUrl(res, next)
    return null
  }

  private async redirectToAuthCodeUrl(res: Response, next: NextFunction) {
    const { verifier, challenge } = await this.idService.generatePkceCodes()

    this.storeVerificationCookie(verifier, res)

    const clientApplication = await this.idService.getClientApplication()
    clientApplication
      .getAuthCodeUrl(this.prepareAuthCodeUrlRequest(challenge))
      .then((url) => res.redirect(url))
      .catch((err) => {
        console.error(err)
        next(err)
      })
  }

  private storeVerificationCookie(verifier: string, res: Response) {
    const verificationData = {
      ...this.authorizationUrlRequestParams,
      code: '',
      codeVerifier: verifier,
    } as VerificationData

    res.cookie(
      this.idService.verifierCookieName,
      this.idService.encodeObject(verificationData),
      { maxAge: 2 * 60 * 60, httpOnly: true }
    )
  }

  private prepareAuthCodeUrlRequest(
    challenge: string
  ): AuthorizationUrlRequest {
    return {
      ...this.authorizationUrlRequestParams,
      responseMode: ResponseMode.FORM_POST, // recommended for confidential clients
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
    }
  }

  private prepareAuthCodeRequestParams(): AuthorizationUrlRequest {
    /**
     * MSAL Node library allows you to pass your custom state as state parameter in the Request object.
     * The state parameter can also be used to encode information of the app's state before redirect.
     * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
     */
    const state: string = this.idService.encodeObject({
      successRedirect: this.configProvider.options.successRedirect || '/',
    })

    return {
      state: state,
      /**
       * In future we could use this to set more specific auth scopes for different user types.
       * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
       * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
       */
      scopes: this.configProvider.options.scopes || [],
      redirectUri: this.configProvider.options.redirectUri,
    }
  }
}
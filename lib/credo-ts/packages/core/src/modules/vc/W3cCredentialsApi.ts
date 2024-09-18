import type {
  StoreCredentialOptions,
  W3cCreatePresentationOptions,
  W3cSignCredentialOptions,
  W3cSignPresentationOptions,
  W3cVerifyCredentialOptions,
  W3cSignWrappedPresentationRequestOptions,
  W3cVerifyPresentationOptions,
  W3cCreatePresentationWrapperOptions, W3cCreatePresentationRequestWrapperOptions, W3cVerifyWrappedPresentationOptions
} from './W3cCredentialServiceOptions'
import type { W3cVerifiableCredential, ClaimFormat } from './models'
import type { W3cCredentialRecord } from './repository'
import type { Query } from '../../storage/StorageService'

import { AgentContext } from '../../agent'
import { injectable } from '../../plugins'

import { W3cCredentialService } from './W3cCredentialService'
import {W3cSignWrappedPresentationOptions} from "./W3cCredentialServiceOptions";
import {W3cSignPresentationRequestOptions} from "./W3cPresentationRequestServiceOptions";

import {W3cPresentationRequest} from "./models";

/**
 * @public
 */
@injectable()
export class W3cCredentialsApi {
  private agentContext: AgentContext
  private w3cCredentialService: W3cCredentialService

  public constructor(agentContext: AgentContext, w3cCredentialService: W3cCredentialService) {
    this.agentContext = agentContext
    this.w3cCredentialService = w3cCredentialService
  }

  public async storeCredential(options: StoreCredentialOptions): Promise<W3cCredentialRecord> {
    return this.w3cCredentialService.storeCredential(this.agentContext, options)
  }

  public async removeCredentialRecord(id: string) {
    return this.w3cCredentialService.removeCredentialRecord(this.agentContext, id)
  }

  public async getAllCredentialRecords(): Promise<W3cCredentialRecord[]> {
    return this.w3cCredentialService.getAllCredentialRecords(this.agentContext)
  }

  public async getCredentialRecordById(id: string): Promise<W3cCredentialRecord> {
    return this.w3cCredentialService.getCredentialRecordById(this.agentContext, id)
  }

  public async findCredentialRecordsByQuery(query: Query<W3cCredentialRecord>): Promise<W3cVerifiableCredential[]> {
    return this.w3cCredentialService.findCredentialsByQuery(this.agentContext, query)
  }

  public async signCredential<Format extends ClaimFormat.JwtVc | ClaimFormat.LdpVc>(
    options: W3cSignCredentialOptions<Format>
  ) {
    return this.w3cCredentialService.signCredential<Format>(this.agentContext, options)
  }

  public async verifyCredential(options: W3cVerifyCredentialOptions) {
    return this.w3cCredentialService.verifyCredential(this.agentContext, options)
  }

  public async createPresentation(options: W3cCreatePresentationOptions) {
    return this.w3cCredentialService.createPresentation(options)
  }

  public async createPresentationWrapper(options: W3cCreatePresentationWrapperOptions) {
    return this.w3cCredentialService.createPresentationWrapper(options)
  }

  public async createPresentationRequestWrapper(options: W3cCreatePresentationRequestWrapperOptions) {
    return this.w3cCredentialService.createPresentationRequestWrapper(options)
  }

  public async signPresentation<Format extends ClaimFormat.JwtVp | ClaimFormat.LdpVp>(
    options: W3cSignPresentationOptions<Format>
  ) {
    return this.w3cCredentialService.signPresentation<Format>(this.agentContext, options)
  }


  public async signPresentationRequest (
      options: W3cSignPresentationRequestOptions
  ): Promise<W3cPresentationRequest> {
    return this.w3cCredentialService.signPresentationRequest(this.agentContext, options)
  }


  public async signWrappedPresentation(
      options: W3cSignWrappedPresentationOptions
  ) {
    return this.w3cCredentialService.signWrappedPresentation(this.agentContext, options)
  }

  public async signWrappedPresentationRequest(
      options: W3cSignWrappedPresentationRequestOptions
  ) {
    return this.w3cCredentialService.signWrappedPresentationRequest(this.agentContext, options)
  }

  public async verifyPresentation(options: W3cVerifyPresentationOptions) {
    return this.w3cCredentialService.verifyPresentation(this.agentContext, options)
  }

  public async verifyWrappedPresentation(options: W3cVerifyWrappedPresentationOptions) {
    return this.w3cCredentialService.verifyWrappedPresentation(this.agentContext, options)
  }
}

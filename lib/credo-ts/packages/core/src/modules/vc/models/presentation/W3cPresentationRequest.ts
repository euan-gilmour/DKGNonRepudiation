import type { W3cHolderOptions } from './W3cHolder'
import type { W3cJsonPresentation } from './W3cJsonPresentation'
import type { JsonObject } from '../../../../types'
import type { W3cVerifiableCredential } from '../credential/W3cVerifiableCredential'
import type { ValidationOptions } from 'class-validator'

import { Expose } from 'class-transformer'
import { ValidateNested, buildMessage, IsOptional, ValidateBy } from 'class-validator'

import { JsonTransformer } from '../../../../utils'
import { SingleOrArray } from '../../../../utils/type'
import { IsUri, IsInstanceOrArrayOfInstances } from '../../../../utils/validators'
import {
  CREDENTIALS_CONTEXT_V1_URL,
  VERIFIABLE_PRESENTATION_REQUEST_URL,
  VERIFIABLE_PRESENTATION_TYPE
} from '../../constants'
import { W3cJsonLdVerifiableCredential } from '../../data-integrity/models/W3cJsonLdVerifiableCredential'
import { W3cJwtVerifiableCredential } from '../../jwt-vc/W3cJwtVerifiableCredential'
import { IsVerifiablePresentationRequestJsonLdContext } from '../../validators'
import { W3cVerifiableCredentialTransformer } from '../credential/W3cVerifiableCredential'

import { IsW3cHolder, W3cHolder, W3cHolderTransformer } from './W3cHolder'
import {LinkedDataProof, LinkedDataProofOptions} from "../../data-integrity/models/LinkedDataProof";
import {DataIntegrityProof, DataIntegrityProofOptions} from '../../data-integrity/models'
import {ProofTransformer} from "../../data-integrity/models/ProofTransformer";
import {DifPresentationExchangeDefinition} from "../../../dif-presentation-exchange";

export interface W3cPresentationRequestOptions {
  id?: string
  context?: Array<string | JsonObject>
  type?: Array<string>
  presentation_definition: DifPresentationExchangeDefinition
  options: {
    challenge: string,
    domain: string
  }
  proof?: SingleOrArray<LinkedDataProofOptions | DataIntegrityProofOptions>
}

export class W3cPresentationRequest {
  public constructor(options: W3cPresentationRequestOptions) {
    if (options) {
      this.context = options.context ?? [VERIFIABLE_PRESENTATION_REQUEST_URL]
      this.type = options.type ?? ["VerifiablePresentationRequest"]
      this.id = options.id
      this.presentation_definition = options.presentation_definition
      this.options = options.options
      this.proof = options.proof
    }
  }

  @Expose({ name: '@context' })
  @IsVerifiablePresentationRequestJsonLdContext()
  public context!: Array<string | JsonObject>

  @IsOptional()
  @IsUri()
  public id?: string


  public options: JsonObject | undefined

  public presentation_definition!: DifPresentationExchangeDefinition

  public type!: Array<string>

  public issuanceDate!: string

  @ProofTransformer()
  @IsInstanceOrArrayOfInstances({ classType: [LinkedDataProof, DataIntegrityProof] })
  @ValidateNested()
  public proof?: SingleOrArray<LinkedDataProof | DataIntegrityProof>


  public toJSON() {
    return JsonTransformer.toJSON(this) as W3cPresentationRequest
  }
}

// Custom validators

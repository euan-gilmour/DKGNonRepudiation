import type { W3cHolderOptions } from './W3cHolder'
import type { W3cJsonPresentation } from './W3cJsonPresentation'
import type { JsonObject } from '../../../../types'
import type { W3cVerifiableCredential } from '../credential/W3cVerifiableCredential'
import type { ValidationOptions } from 'class-validator'
import type {W3cVerifiablePresentation} from '.'

import { Expose } from 'class-transformer'
import { ValidateNested, buildMessage, IsOptional, ValidateBy } from 'class-validator'

import { JsonTransformer } from '../../../../utils'
import { SingleOrArray } from '../../../../utils/type'
import { IsUri, IsInstanceOrArrayOfInstances } from '../../../../utils/validators'
import {
  CREDENTIALS_CONTEXT_V1_URL,
  VERIFIABLE_PRESENTATION_TYPE,
  WRAPPER_VERIFIABLE_PRESENTATION_REQUEST_TYPE, WRAPPER_VERIFIABLE_PRESENTATION_REQUEST_URL,
  WRAPPER_VP_CONTEXT_URL
} from '../../constants'
import { W3cJsonLdVerifiableCredential } from '../../data-integrity/models/W3cJsonLdVerifiableCredential'
import { W3cJwtVerifiableCredential } from '../../jwt-vc/W3cJwtVerifiableCredential'
import { IsCredentialJsonLdContext } from '../../validators'
import { W3cVerifiableCredentialTransformer } from '../credential/W3cVerifiableCredential'

import { IsW3cHolder, W3cHolder, W3cHolderTransformer } from './W3cHolder'
import {W3cPresentationRequest} from ".";
import type { AcpPolicy } from '@sphereon/pex-models'
import {LinkedDataProof, LinkedDataProofOptions} from "../../data-integrity/models/LinkedDataProof";
import {DataIntegrityProof, DataIntegrityProofOptions} from '../../data-integrity/models'
import {ProofTransformer} from "../../data-integrity/models/ProofTransformer";
export interface W3cPresentationWrapperOptions {
  id?: string
  context?: Array<string | JsonObject>
  type?: Array<string>
  wrappedVPR: W3cPresentationRequest,
  termsAndCondition: AcpPolicy,
  proof?: SingleOrArray<LinkedDataProofOptions | DataIntegrityProofOptions>
}

export class W3cPresentationRequestWrapper {
  public constructor(options: W3cPresentationWrapperOptions) {
    if (options) {
      this.context = options.context ?? [WRAPPER_VERIFIABLE_PRESENTATION_REQUEST_URL]
      this.id = options.id
      this.type = options.type ?? [WRAPPER_VERIFIABLE_PRESENTATION_REQUEST_TYPE]
      this.wrappedVPR = options.wrappedVPR
      this.termsAndCondition = options.termsAndCondition
      this.proof = options.proof
    }
  }

  @Expose({ name: '@context' })
  @IsCredentialJsonLdContext()
  public context!: Array<string | JsonObject>

  @IsOptional()
  @IsUri()
  public id?: string

  @IsVerifiablePresentationRequestWrapperType()
  public type!: Array<string>

  public wrappedVPR!: W3cPresentationRequest

  public termsAndCondition?: AcpPolicy

  @ProofTransformer()
  @IsInstanceOrArrayOfInstances({ classType: [LinkedDataProof, DataIntegrityProof] })
  @ValidateNested()
  public proof?: SingleOrArray<LinkedDataProof | DataIntegrityProof>

  public toJSON() {
    return JsonTransformer.toJSON(this) as W3cJsonPresentation
  }
}

// Custom validators

export function IsVerifiablePresentationRequestWrapperType(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsVerifiablePresentationRequestWrapperType',
      validator: {
        validate: (value): boolean => {
          if (Array.isArray(value)) {
            return value.includes(WRAPPER_VERIFIABLE_PRESENTATION_REQUEST_TYPE)
          }
          return false
        },
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be an array of strings which includes "VerifiablePresentationRequestWrapper"',
          validationOptions
        ),
      },
    },
    validationOptions
  )
}

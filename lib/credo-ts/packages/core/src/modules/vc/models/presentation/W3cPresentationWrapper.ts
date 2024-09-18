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
import {CREDENTIALS_CONTEXT_V1_URL, VERIFIABLE_PRESENTATION_TYPE, WRAPPER_VP_CONTEXT_URL} from '../../constants'
import { W3cJsonLdVerifiableCredential } from '../../data-integrity/models/W3cJsonLdVerifiableCredential'
import { W3cJwtVerifiableCredential } from '../../jwt-vc/W3cJwtVerifiableCredential'
import { IsCredentialJsonLdContext } from '../../validators'
import { W3cVerifiableCredentialTransformer } from '../credential/W3cVerifiableCredential'

import { IsW3cHolder, W3cHolder, W3cHolderTransformer } from './W3cHolder'

export interface W3cPresentationWrapperOptions {
  id?: string
  context?: Array<string | JsonObject>
  type?: Array<string>
  wrappedVP: W3cVerifiablePresentation
  holder?: string | W3cHolderOptions
}

export class W3cPresentationWrapper {
  public constructor(options: W3cPresentationWrapperOptions) {
    if (options) {
      this.context = options.context ?? [CREDENTIALS_CONTEXT_V1_URL, WRAPPER_VP_CONTEXT_URL]
      this.id = options.id
      this.type = options.type ?? [VERIFIABLE_PRESENTATION_TYPE]
      this.wrappedVP = options.wrappedVP

      if (options.holder) {
        this.holder = typeof options.holder === 'string' ? options.holder : new W3cHolder(options.holder)
      }
    }
  }

  @Expose({ name: '@context' })
  @IsCredentialJsonLdContext()
  public context!: Array<string | JsonObject>

  @IsOptional()
  @IsUri()
  public id?: string

  @IsVerifiablePresentationWrapperType()
  public type!: Array<string>

  @W3cHolderTransformer()
  @IsW3cHolder()
  @IsOptional()
  public holder?: string | W3cHolder

  public wrappedVP!: W3cVerifiablePresentation

  public get holderId(): string | null {
    if (!this.holder) return null

    return this.holder instanceof W3cHolder ? this.holder.id : this.holder
  }

  public toJSON() {
    return JsonTransformer.toJSON(this) as W3cJsonPresentation
  }
}

// Custom validators

export function IsVerifiablePresentationWrapperType(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsVerifiablePresentationWrapperType',
      validator: {
        validate: (value): boolean => {
          if (Array.isArray(value)) {
            return value.includes(VERIFIABLE_PRESENTATION_TYPE)
          }
          return false
        },
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be an array of strings which includes "VerifiablePresentation"',
          validationOptions
        ),
      },
    },
    validationOptions
  )
}

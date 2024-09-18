import type { ProblemReportMessageOptions } from '../../problem-reports/messages/ProblemReportMessage'

import { IsValidMessageType, parseMessageType } from '../../../utils/messageType'
import { ProblemReportMessage } from '../../problem-reports/messages/ProblemReportMessage'

export type DidRotateProblemReportMessageOptions = ProblemReportMessageOptions

/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0035-report-problem/README.md
 */
export class DidRotateProblemReportMessage extends ProblemReportMessage {
  public constructor(options: DidRotateProblemReportMessageOptions) {
    super(options)
  }

  @IsValidMessageType(DidRotateProblemReportMessage.type)
  public readonly type = DidRotateProblemReportMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://didcomm.org/did-rotate/1.0/problem-report')
}

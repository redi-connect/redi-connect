import { plainToClass, Type } from 'class-transformer'
import { RecordProps } from '../base-interfaces-types-classes'

export class TpJobListingRecordProps implements RecordProps {
  Id: string

  Title__c?: string
  Location__c?: string
  Summary__c?: string
  Ideal_Technical_Skills__c?: string
  Relates_to_Positions__c?: string
  Employment_Type__c?: string
  Language_Requirements__c?: string
  Salary_Range__c?: string
  Remote_Possible__c: boolean

  @Type(() => Date)
  CreatedDate: Date
  @Type(() => Date)
  LastModifiedDate: Date

  public static create(rawProps: any) {
    return plainToClass(TpJobListingRecordProps, rawProps, {})
  }
}

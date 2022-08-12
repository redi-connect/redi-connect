import { plainToClass, Type } from 'class-transformer'
import {
  PicklistValue,
  PicklistValuesSemicolonSeparated,
  RecordProps,
} from '../base-interfaces-types-classes'
import { ContactRecordProps, Gender } from '../common-objects'

export class ConProfileRecordProps implements RecordProps {
  Id: string
  Email: string
  Avatar_Image_URL__c?: string
  @Type(() => Date)
  CreatedDate: Date
  Desired_Job__c?: string
  Education__c?: PicklistValue
  Expectations__c?: string
  Job_Title__c?: string
  Languages__c?: PicklistValuesSemicolonSeparated
  @Type(() => Date)
  LastModifiedDate: Date
  Main_Occupation_Other__c?: string
  Mentoring_Topics__c?: PicklistValuesSemicolonSeparated
  Name: string
  Occupation__c?: string
  Occupation_Category__c?: PicklistValue
  @Type(() => Boolean)
  Opt_Out_Mentees_From_Other_Locations__c?: boolean
  Personal_Description__c?: string
  Place_of_Employment__c?: string
  @Type(() => Date)
  Profile_First_Approved_At__c?: Date
  Profile_Status__c?: PicklistValue
  ReDI_Course__c: PicklistValue
  ReDI_Location__c: PicklistValue
  Study_Name__c?: string
  Study_Place__c?: string
  Work_Place__c?: string
  total_mentee_capacity__c?: number

  Active_Mentorship_Matches_Mentee__c: number
  Active_Mentorship_Matches_Mentor__c: number
  Has_Available_Mentorship_Slot__c: boolean
  Doesnt_Have_Available_Mentorship_Slot__c: boolean

  @Type(() => ContactRecordProps)
  Contact__r: ContactRecordProps

  RecordType: {
    DeveloperName: string
  }
  props: {
    Email: string
    Id: string
    FirstName: string
    LastName: string
    redi_Contact_Gender__c: Gender
    ReDI_Birth_Date__c: Date
    LinkedIn_Profile__c: string
    ReDI_GitHub_Profile__c: string
    ReDI_Slack_Username__c: string
    MobilePhone: string
    Loopback_User_ID__c: string
    ReDI_Age__c: number
  }

  public static create(rawProps: any) {
    return plainToClass(ConProfileRecordProps, rawProps, {})
  }
}
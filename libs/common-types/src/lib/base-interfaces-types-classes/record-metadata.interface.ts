export interface RecordMetadata {
  SALESFORCE_OBJECT_NAME: string
  SALESFORCE_OBJECT_FIELDS: string[]
  SALESFORCE_CHILD_OBJECTS?: { name: string; fields: string[] }[]
}
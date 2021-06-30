export class ErrorWritingPreviousVersionNotMatched extends Error {
  constructor() {
    super();
    this.name = "ErrorWritingPreviousVersionNotMatched";
    this.message =
      "Error saving to DynamoDB Table: 'previousVersion' doesn't match currently stored 'version'. The data to-be-written is not the next version.";
  }
}

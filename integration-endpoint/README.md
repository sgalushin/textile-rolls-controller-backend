# Incoming Message Processor

This service provides an HTTP endpoint for 1C:Enterprise ERP to send POST requests, containing events describing changes to products and characteristics.

The HTTP endpoint address corresponds to the output parameter `APIAdress` of this CloudFormation Stack.

For authentication, each request must contain `x-api-key` in the header, which equals to the API key that was specified during backend deployment.
The body of each post request must contain the event itself (in JSON). Examples of events are in `incoming-message-processor/src/event-schemas/examples`.

If needed, change the `UsagePlan` of the API key in the `template.yaml` to modify quota / throttling limits.

The following operations are performed by this service on each request: 
 
 - `x-api-key` in the header of request is verified.
 - The body of request is validated by the corresponding JSON schema.
 - Blobs with images are deleted from the event body. Images are saved to S3 bucket. This is done to so that the message fits into the SQS limit.
 - The event is sent to the corresponing SQS Queue.

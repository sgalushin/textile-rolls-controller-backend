deploy:
	(cd incoming-message-processor && npm run build)
	sam build
	sam deploy --no-fail-on-empty-changeset --stack-name trc-$(STAGE)-integration-endpoint --no-confirm-changeset --parameter-overrides "ParameterKey=Stage,ParameterValue=$(STAGE) ParameterKey=ApiKey,ParameterValue=$(INTEGRATION_API_KEY)" --region $(REGION)  --resolve-s3 --capabilities CAPABILITY_IAM

install:
	(cd incoming-message-processor && npm ci)

test:
	(cd incoming-message-processor && npm run test)
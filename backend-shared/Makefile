deploy:
	sam build
	sam deploy --no-fail-on-empty-changeset --stack-name trc-$(STAGE)-common --no-confirm-changeset --parameter-overrides "ParameterKey=Stage,ParameterValue=$(STAGE)" --region $(REGION)  --resolve-s3 --capabilities CAPABILITY_IAM

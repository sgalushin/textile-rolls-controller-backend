deploy:
	(cd catalog-crud  && rm -rf ./dist ./build && npm run build)
	sam package --s3-bucket $(BUCKET_FOR_LAMBDAS) --output-template-file ./template-export.yaml
	sam deploy -t template-export.yaml --no-fail-on-empty-changeset --stack-name trc-$(STAGE)-product-catalog --no-confirm-changeset --parameter-overrides "ParameterKey=Stage,ParameterValue=$(STAGE)" --region $(REGION)  --resolve-s3 --capabilities CAPABILITY_IAM

install:
	(cd catalog-crud && npm ci)

test:
	(cd catalog-crud && npm run test)
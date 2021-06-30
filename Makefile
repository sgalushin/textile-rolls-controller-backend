ifndef STAGE
$(error STAGE is not set)
endif
ifndef REGION
$(error REGION is not set)
endif
ifndef INTEGRATION_API_KEY
$(error INTEGRATION_API_KEY is not set)
endif
ifndef BUCKET_FOR_LAMBDAS
$(error BUCKET_FOR_LAMBDAS is not set)
endif

export

target:
	$(info ${HELP_MESSAGE})
	@exit 0

deploy:

	$(info [*] Deploying...)
	$(MAKE) deploy.backend-shared
	$(MAKE) deploy.integration-endpoint
	$(MAKE) deploy.product-catalog
	$(MAKE) deploy.rolls


deploy.backend-shared:
	$(MAKE) -C backend-shared deploy

deploy.integration-endpoint:
	$(MAKE) -C integration-endpoint deploy

deploy.product-catalog:
	$(MAKE) -C product-catalog deploy

deploy.rolls:
	$(MAKE) -C rolls deploy

define HELP_MESSAGE

	Environment variables:

	These variables are automatically filled at CI time except STRIPE_SECRET_KEY
	If doing a dirty/individual/non-ci deployment locally you'd need them to be set

	STAGE: "dev"
		Description: Feature branch name used as part of stacks name; added by Amplify Console by default
	REGION: "eu-west-1"
		Description: AWS Region, where the stack will be deployed
	INTEGRATION_API_KEY: "t4b4e2egamkio8s3n0u6"
		Description: An API Key, a string of minimum 20 characters.
		This key will be used as an authentification of a ERP Master Data system to send events to TRC integration endpoint.
		It must be included in all requests from a ERP system in the 'x-api-key' header.

	Common usage:
endef

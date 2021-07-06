check-var-defined = $(if $(strip $($1)),,$(error "$1" is not defined))

export

target:
	$(info ${HELP_MESSAGE})
	@exit 0

deploy:
	$(call check-var-defined,STAGE)
	$(call check-var-defined,REGION)
	$(call check-var-defined,INTEGRATION_API_KEY)
	$(call check-var-defined,BUCKET_FOR_LAMBDAS)

	$(info [*] Deploying...)
	$(MAKE) deploy.backend-shared
	$(MAKE) deploy.integration-endpoint
	$(MAKE) deploy.product-catalog
	$(MAKE) deploy.rolls

install:
	$(info [*] Installing packages...)
	$(MAKE) install.integration-endpoint
	$(MAKE) install.product-catalog
	$(MAKE) install.rolls


deploy.backend-shared:
	$(MAKE) -C backend-shared deploy

deploy.integration-endpoint:
	$(MAKE) -C integration-endpoint deploy

deploy.product-catalog:
	$(MAKE) -C product-catalog deploy

deploy.rolls:
	$(MAKE) -C rolls deploy

install.integration-endpoint:
	$(MAKE) -C integration-endpoint install

install.product-catalog:
	$(MAKE) -C product-catalog install

install.rolls:
	$(MAKE) -C rolls install


define HELP_MESSAGE
	See README.md.
endef

# A Self-Documenting Makefile

.PHONY: clean deploy

all: build

build:
	hugo -v

deploy: clean build
	rsync -Prtc --delete public/ felixhanley.info@ww01.mel.userspace.com.au:htdocs/

clean: ## Clean public
	@rm -rf public

help:
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

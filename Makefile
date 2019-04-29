pdopts=	-f markdown+yaml_metadata_block+smart --data-dir=.
src=	$(shell find content -type f -name '*.md')
res=	$(shell find static -type f)

all: public public/felix_hanley.pdf

public: $(src) $(res)
	hugo -v

public/felix_hanley.pdf: content/work/_index.md public templates/default.html templates/default.latex
	pandoc $(pdopts) --pdf-engine=xelatex --standalone -o public/felix_hanley.pdf $<

.PHONY: deploy
deploy: all
	rsync -Prtc --delete public/ felixhanley.info@silver.userspace.com.au:htdocs/

.PHONY: clean
clean: ## Clean public
	@rm -rf public

help:
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

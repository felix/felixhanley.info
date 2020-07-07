pdopts=		-f markdown+yaml_metadata_block+smart --data-dir=.
input=		src
output=		public

src=	$(shell find $(input) -type f -name '*.m4')
dst=	$(patsubst $(input)/%.m4,$(output)/%/index.html,$(src))
navs=	$(patsubst $(input)/%.m4,$(input)/%.nav,$(src))

build: layout/nav.html $(dst)

.SUFFIXES:

%.md: %.m4
	m4 -I layout $< >$@

$(output)/%/index.html: $(input)/%.md
	mkdir -p $(@D)
	pandoc -f markdown -t html $< >$@

%/index.html: $(shell find % -type f -name '*.m4') %/index.m4

$(output)/posts.m4: $(input)/posts/%.m4
	#mkdir -p $(dir $(basename $(*D)))
	m4 -I nav -D __category=$(basename $(*D)) $< >$@

layout/nav.html: $(navs)
	cat $< > $@

# $(output)/rss.xml: layout/feed.m4
# 	@m4 -D__latest=$(LATEST) $< > $@

.PHONY: resume
resume: public/felix_hanley.pdf

public/felix_hanley.pdf: resume/data.md resume/meta.yaml templates/default.latex
	pandoc $(pdopts) --standalone --metadata-file=resume/meta.yaml -o $@ $<

.PHONY: deploy
deploy: build
	rsync -Prtc --delete --exclude '*.pdf' public/ felixhanley.info@silver.userspace.com.au:htdocs/
	rsync -Put public/felix_hanley.pdf felixhanley.info@silver.userspace.com.au:htdocs/

.PHONY: clean
clean:
	rm -rf public
	rm -rf resources
	rm -f $(navs)
	rm -f layout/nav.html

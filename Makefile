SRC	!= find content -type f
STATIC	= $(patsubst static/%,public/%,$(shell find static -type f))
NOTES	!= ls -t notes/*.md
DST	:= $(patsubst content/%.md,public/%.html,$(SRC)) \
	   $(patsubst %.md,public/%.html,$(NOTES))
TMPL	:= templates/default.html
PDOPTS	:= -f markdown+link_attributes -t html --standalone --template $(TMPL)

.PHONY: all
all: $(DST) notes tags static \
	public/work.html \
	public/felix_hanley.pdf

.PHONY: notes tags
notes: public/notes/index.html ;
tags: public/tags/index.html ;

.PHONY: static
static: $(STATIC) ;
public/%: static/%
	@[ -d $(@D) ] || mkdir -p $(@D)
	cp $< $@

public/%.html: content/%.md $(TMPL)
	mkdir -p $(@D)
	pandoc $(PDOPTS) -o $@ $<
public/notes/%.html: notes/%.md $(TMPL)
	mkdir -p $(@D)
	pandoc $(PDOPTS) -o $@ $<
content/work.md: resume/data.md
	mkdir -p $(@D)
	printf -- '---\ntitle: Résumé\ndescription: Résumé of Felix Hanley\n---\n\n' > $@
	printf -- '[PDF version](/felix_hanley.pdf){#pdf-resume}\n\n' >> $@
	cat $< >> $@

public/tags/index.html: content/tags/index.md $(TMPL)
	mkdir -p public/tags
	for md in content/tags/*; do \
		fn="$$(basename -s '.md' $$md)"; \
		pandoc $(PDOPTS) -o "public/tags/$$fn.html" $$md; \
		done
content/tags/index.md: $(NOTES) scripts/processnotes.awk
	mkdir -p $(@D)
	awk -f scripts/processnotes.awk \
		-v tagpath=$(@D) \
		-v notesindex=content/notes/index.md \
		notes/*.md

public/felix_hanley.pdf: resume/data.md resume/meta.yaml templates/default.latex
	mkdir -p public
	pandoc -f markdown+yaml_metadata_block+smart \
		--data-dir=. --standalone --metadata-file=resume/meta.yaml \
		-o $@ resume/data.md

deploy: all
	rsync -ruct4 \
		--delete public/ --exclude '*.swp' --delete-excluded \
		felixhanley.info@gunn.userspace.com.au:htdocs/

clean:
	rm -rf public
	rm -rf work
	rm -rf content/tags
	rm -rf resources

SRC	!= find content ! -name 'notes/index.md' -type f
DST	:= $(patsubst content/%.md,public/%.html,$(SRC))
STATIC	= $(patsubst static/%,public/%,$(shell find static -type f))
#NOTES	!= find content/notes ! -name 'index.md' -type f -name '*.md'
NOTES	!= ls -t content/notes/*.md
TMPL	:= templates/default.html
PDOPTS	:= -f markdown+link_attributes -t html --standalone --template $(TMPL)

.PHONY: all
all: content notes tags static \
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

.PHONY: content
content: content/work.md $(DST)

public/%.html: content/%.md $(TMPL)
	mkdir -p $(@D)
	pandoc $(PDOPTS) -o $@ $<

content/work.md: resume/data.md
	mkdir -p $(@D)
	printf -- '---\ntitle: Résumé\ndescription: Résumé of Felix Hanley\n---\n\n' > $@
	printf -- '[PDF version](/felix_hanley.pdf){#pdf-resume}\n\n' >> $@
	cat $< >> $@

public/notes/index.html: work/notes/index.md $(TMPL)
	mkdir -p $(@D)
	pandoc $(PDOPTS) -o $@ $<
work/notes/index.md: $(NOTES) scripts/notesindex.awk
	mkdir -p $(@D)
	awk -f scripts/notesindex.awk -v outpath=$(@D) content/notes/*.md

public/tags/index.html: work/tags/index.md $(TMPL)
	mkdir -p public/tags
	for md in work/tags/*; do \
		fn="$$(basename -s '.md' $$md)"; \
		pandoc $(PDOPTS) -o "public/tags/$$fn.html" $$md; \
		done
work/tags/index.md: $(NOTES) scripts/tagindex.awk
	mkdir -p $(@D)
	awk -f scripts/tagindex.awk -v outpath=$(@D) content/notes/*.md

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
	rm -f content/work.md
	rm -rf resources

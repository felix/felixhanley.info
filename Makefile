SRC	!= find content -type f -name '*.md'
DST	= $(patsubst content/%.md,public/%.html,$(SRC))
STATIC	= $(patsubst static/%,public/%,$(shell find static -type f))
NOTES	!= find content/notes -type f -name '*.md'
TMPL	:= templates/default.html
PDOPTS	:= -f markdown -t html --standalone --template $(TMPL)

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
	printf -- '<div id="pdf-resume"><a href="/felix_hanley.pdf">PDF version</a></div>' >> $@
	cat $< >> $@

public/notes/index.html: work/notes/index.md
	pandoc $(PDOPTS) -o $@ $<
work/notes/index.md: $(NOTES)
	mkdir -p $(@D)
	printf -- '---\ntitle: notes\n---\n\n' > "$@"
	for md in $^; do \
		title="$$(grep 'title' "$$md" |cut -d' ' -f2-)"; \
		html="$$(printf "$${md%%.md}.html" |cut -d'/' -f2-)"; \
		printf -- '- [%s](/%s)\n' "$$title" "$$html" >> $@; \
		done

public/tags/index.html: work/tags/index.md
	pandoc $(PDOPTS) -o $@ $<
work/tags/index.md: $(SRC)
	mkdir -p $(@D)
	printf -- '---\ntitle: Tags\n---\n\n' > "$@"
	rm -f "$(@D)/*.html"
	for md in $^; do \
		title="$$(grep 'title' "$$md" |cut -d' ' -f2-)"; \
		html="$$(printf "$${md%%.md}.html" |cut -d'/' -f2-)"; \
		for tag in $$(awk '/keywords/ {gsub(/[\[\]]/,"",$$2); split($$2,a,",")}END{for (k in a) { print a[k]}}' "$$md" ); do \
		fn="$(@D)/$$tag"; \
		printf '[%s](/%s)\n' "$$tag" "$$fn.html" >> $@; \
		[ -f "$$fn" ] || printf -- '---\ntitle: Pages tagged %s\n---\n\n' "$$tag" > "$$fn"; \
		printf -- '- [%s](/%s)\n' "$$title" "$$html" >> $$fn; \
		done; \
		done
	mkdir -p public/tags
	for md in $(@D)/*; do \
		pandoc $(PDOPTS) -o "public/tags/$$(basename $$md).html" $$md; \
		done

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

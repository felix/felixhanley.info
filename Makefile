pdopts=	-f markdown+yaml_metadata_block+smart --data-dir=.
src=	$(shell find content static layouts -type f)

build: public public/felix_hanley.pdf

public: $(src)
	hugo -v

public/felix_hanley.pdf: content/work/_index.md public templates/default.html templates/default.latex
	pandoc $(pdopts) --standalone -o public/felix_hanley.pdf $<

.PHONY: deploy
deploy: all
	rsync -Prtc --delete public/ felixhanley.info@silver.userspace.com.au:htdocs/

.PHONY: clean
clean:
	rm -rf public

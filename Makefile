pdopts=	-f markdown+yaml_metadata_block+smart --data-dir=.
src=	$(shell find content static layouts resume -type f)

.PHONY: build
build: public resume

.PHONY: public
public: $(src)
	hugo -v

.PHONY: resume
resume: public/felix_hanley.pdf

public/felix_hanley.pdf: resume/data.md resume/meta.yaml templates/default.latex
	pandoc $(pdopts) --standalone --metadata-file=resume/meta.yaml -o $@ $<

.PHONY: deploy
deploy: build
	rsync -Prtc --delete public/ felixhanley.info@silver.userspace.com.au:htdocs/

.PHONY: clean
clean:
	rm -rf public
	rm -rf resources

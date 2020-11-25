.POSIX:
.SUFFIXES:

src	!= find content static layouts resume -type f

build: $(src) public/felix_hanley.pdf static/css/syntax.css
	hugo -v

static/css/syntax.css:
	hugo gen chromastyles --style=solarized-light >$@

public/felix_hanley.pdf: resume/data.md resume/meta.yaml templates/default.latex
	mkdir -p public
	pandoc -f markdown+yaml_metadata_block+smart \
		--data-dir=. --standalone --metadata-file=resume/meta.yaml \
		-o $@ resume/data.md

deploy: build
	rsync -Pruct --delete public/ felixhanley.info@ftp01.userspace.com.au:htdocs/

clean:
	rm -f static/css/syntax.css
	rm -rf public/*
	rm -rf resources

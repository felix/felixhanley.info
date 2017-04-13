all: build

build:
	hugo -v

deploy:
	rsync -Prtc --delete public/ felixhanley.info@ww01.mel.userspace.com.au:htdocs/

clean:
	@rm -rf public

.PHONY: clean deploy

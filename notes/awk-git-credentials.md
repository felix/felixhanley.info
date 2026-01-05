---
title: Pass for git credentials
keywords: [git,awk]
date: 2026-01-05
---

Using [the standard unix password manager](https://www.passwordstore.org/) to 
store Git creds.

Save this in `$PATH` as `git-credential-pass-store` (name is important) and 
`chmod +x`:

```awk
#!/bin/awk -f

function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
function trim(s) { return rtrim(ltrim(s)); }

BEGIN{
	if (ARGV[1] != "get") {
		exit 0
	}
	ARGC--
	FS="="
	getline
}
$1 == "host" {
	username = ENVIRON["USER"]
	FS=":"
	pass = "pass show "$2
	while ((pass | getline) > 0) {
		if ($1 ~ "login|user") {
			username = trim($2)
		}
		if ($1 ~ "token|pat") {
			printf "password=%s\nusername=%s\n", trim($2), username
			exit 0
		}
	}
	close(pass)
	exit 0
}
```

...then configure git in `~/.gitconfig`:

```ini
[credential "https://github.com"]
	helper = pass-store
```

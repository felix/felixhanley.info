---
title: Awk as CGI
keywords: [awk,cgi]
date: 2026-01-05
---

Reasonably basic, just need to ensure the headers are correct:

```awk
#!/bin/awk -f

BEGIN {
    printf "Status: 200 OK\n"
    printf "Content-type: text/html\n\n"
    print "<!doctype html><html lang=\"en\">"

    print "<ul>"
    for ( key in ENVIRON ) {
        printf "<li>%s: %s</li>\n",key,ENVIRON[key]
    }
    print "</ul>"
    print "</html>"

    # stuff like this too
    # n = split(ENVIRON["QUERY_STRING"],params,/[&=]/)
}
```

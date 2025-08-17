function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
function trim(s) { return rtrim(ltrim(s)); }
BEGIN{
	indexfn = (outpath "/index.md")
}
/^keywords: / {
	$1=""
	gsub(/[\[\]]/,"",$0)
	split($0,tags,",")
}
/^title: / {
	$1=""
	title = trim($0)
}
/^---/ && title!=""{
	linkcount = 0
	link = FILENAME
	gsub(/\.md$/,".html",link)
	gsub(/[^/]+\//,"",link)
	for (i in tags) {
		tag = trim(tags[i])
		tagcount[tag] += 1
		taglinks[tag] = (taglinks[tag] sprintf("- [%s](/notes/%s)\n",title,link))
	}
	title=""
	# delete tags
}
END{
	printf("---\ntitle: Tags\n---\n\n") > indexfn
	for (tag in tagcount) {
		tagfn = (outpath "/" tag ".md")
		printf("---\ntitle: Pages tagged %s\n---\n\n",tag) > tagfn
		printf("%s",taglinks[tag]) >> tagfn
		# Also add to tag index page
		printf("[%s _%d_](%s){.tag}\n",tag,tagcount[tag],tag".html") >> indexfn
	}
}

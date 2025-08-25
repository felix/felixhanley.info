function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
function trim(s) { return rtrim(ltrim(s)); }

# variables: tagpath notesindex

BEGIN{
	tagindex = (tagpath "/index.md")
	printf("---\ntitle: Notes\n---\n\n") > notesindex
	printf("Things I want to remember. Writing them down helps.\n\nThey may be incomplete, incorrect, or incomprehensible. Here be dragons. [Here be tags](/tags/)\n\n") >> notesindex
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
	link = FILENAME
	gsub(/\.md$/,".html",link)
	gsub(/[^/]+\//,"",link)
	printf("- [%s](/notes/%s)",title,link) >> notesindex
	for (i in tags) {
		tag = trim(tags[i])
		tagcount[tag] += 1
		taglinks[tag] = (taglinks[tag] sprintf("- [%s](/notes/%s)\n",title,link))
		printf(" [%s](/tags/%s){.tag}",tag,tag".html") >> notesindex
	}
	printf("\n") >> notesindex
	title=""
}
END{
	printf("---\ntitle: Tags\n---\n\n") > tagindex
	for (tag in tagcount) {
		tagfn = (tagpath "/" tag ".md")
		printf("---\ntitle: Pages tagged %s\n---\n\n",tag) > tagfn
		printf("%s",taglinks[tag]) >> tagfn
		# Also add to tag index page
		printf("[%s _%d_](%s){.tag}\n",tag,tagcount[tag],tag".html") >> tagindex
	}
}

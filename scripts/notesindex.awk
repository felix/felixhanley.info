function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
function trim(s) { return rtrim(ltrim(s)); }
BEGIN{
	indexfn = (outpath "/index.md")
	printf("---\ntitle: Notes\n---\n\n") > indexfn
	printf("Things I want to remember. Writing them down helps.\n\nThey may be incomplete, incorrect, or incomprehensible. Here be dragons. [Here be tags](/tags/)\n\n") >> indexfn
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
	printf("- [%s](/notes/%s)",title,link) >> indexfn
	for (i in tags) {
		tag = trim(tags[i])
		printf(" [%s](/tags/%s){.tag}",tag,tag".html") >> indexfn
	}
	printf("\n") >> indexfn
	title=""
}

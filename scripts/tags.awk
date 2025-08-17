/keywords/ {
	gsub(/[\[\]]/,"",$2)
	split($2,tags,",")
}
END{
	for (i in tags) {
		print tags[i]
	}
}

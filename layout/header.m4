ifdef(`__feed',
`<item> ifdef(`__title', `<title>__title</title>') <link>https://felixhanley.info/__id.html</link> <description>',
`<html lang="en-au">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
		<meta name="description" content="Personal website of Felix Hanley">
		<meta charset="UTF-8">
		<title>ifdef(`__title', `__title &middot; ')Felix Hanley</title>
		<link rel="stylesheet" href="/css/default.css">
		<link rel="stylesheet" href="/css/syntax.css">
		<link rel="shortcut icon" href="/favicon.png">
		<script async src="//stats.userspace.com.au/sws.js" data-id="2"></script>
		<noscript><img src="//stats.userspace.com.au/sws.gif?id=2" style="border:0" alt="" /></noscript>
	</head>
	<body>
		<header class="menu">
			<a class="menu__link menu__link--title" href="https://felixhanley.info">Felix Hanley</a>
			<a class="menu__toggle" id="nav-toggle" href="#"><span></span></a>
			<nav class="menu__group">
				include(nav.html)
			</nav>
		</header>

		<main class="content">
			<article class="content__article">
				ifdef(`__title', `<h1 class="title title--level1">__title</h1>')
				')

dnl vim: ft=html.m4 :

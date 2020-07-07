<header class="menu">
  <a class="menu__link menu__link--title" href="https://felixhanley.info">Felix Hanley</a>
  <a class="menu__toggle" id="nav-toggle" href="#"><span></span></a>
  <nav class="menu__group">
    {{ $currentPage := . }}
    {{ range .Site.Menus.main }}
    <a class="menu__link{{ if or ($currentPage.IsMenuCurrent "main" .) ($currentPage.HasMenuCurrent "main" .) }} menu__link--active{{ end }}" href="{{ .URL }}" title="{{ .Title }}"> {{ .Name }} </a>
    {{ if .HasChildren }}
    <nav class="menu__group">
    {{ range $child := .Children }}
      <a class="menu__link menu__link--nested {{if $currentPage.IsMenuCurrent "main" . }}menu__link--active{{ end }}" href="{{ $child.URL }}" title="{{ $child.Title }}"> {{ $child.Name }} </a>
    {{ end }}
    </nav>
    {{ end }}
    {{ end }}
  </nav>

</header>

dnl vim: ft=html.m4 :

---
draft: true
title: Go string concatenation comparison
date: 2018-05-01
keywords: go concatenation
description: Comparing string concatenation methods in Go
tags:
- go
- benchmark
---

There are a variety of methods of bulk string concatenation and some are faster
than others:

## Concatenation using '+'

```go
func BenchmarkPlus(b *testing.B) {
	var str string

	for n := 0; n < b.N; n++ {
		str += "x"
	}

	if len(str) != b.N {
		b.Errorf("got %d, want %d", len(str), b.N)
	}
}
```

## Concatenation using `fmt` package

```go
func BenchmarkFmt(b *testing.B) {
	var str string

	for n := 0; n < b.N; n++ {
		str = fmt.Sprintf("%s%s", str, "x")
	}

	if len(str) != b.N {
		b.Errorf("got %d, want %d", len(str), b.N)
	}
}
```

## Concatenation using `strings.Builder`

```go
func BenchmarkBuilder(b *testing.B) {
	var str strings.Builder

	for n := 0; n < b.N; n++ {
		str.WriteString("x")
	}

	if len(str.String()) != b.N {
		b.Errorf("got %d, want %d", len(str.String()), b.N)
	}
}
```

## Comparison

```shell
$ go test -bench=. -test.benchmem
goos: darwin
goarch: amd64
cpu: Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz
BenchmarkFmt-12          1000000            128244 ns/op         1006374 B/op          4 allocs/op
BenchmarkPlus-12         1000000             62706 ns/op          503994 B/op          1 allocs/op
BenchmarkBuilder-12     520606197                2.449 ns/op           5 B/op          0 allocs/op
PASS
ok      _/var/tmp/concat 194.673s
```

Interesting!

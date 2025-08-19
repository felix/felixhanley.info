---
title: Go string concatenation comparison
date: 2018-05-01
keywords: [go,benchmark]
description: Comparing string concatenation methods in Go
---

There are a variety of methods of bulk string concatenation and some are faster
than others:

UPDATE 20220704: Re-ran the benchmarks, they got slower!
UPDATE 20250819: Re-ran the benchmarks, fmt got slower

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
$ go version
go version go1.24.5 linux/amd64
$ go test -bench=. -test.benchmem
goos: linux
goarch: amd64
pkg: benchmarks
cpu: 11th Gen Intel(R) Core(TM) i7-1165G7 @ 2.80GHz
BenchmarkFmt-8       	1000000	   152187 ns/op	1006183 B/op	      3 allocs/op
BenchmarkPlus-8      	1000000	    49599 ns/op	 503996 B/op	      1 allocs/op
BenchmarkBuilder-8   	557699485	        1.856 ns/op	      5 B/op	      0 allocs/op
PASS
ok  	benchmarks	204.096s
```

```shell
$ go version
go version go1.18.3 darwin/amd64
$ go test -bench=. -test.benchmem
goos: darwin
goarch: amd64
cpu: Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz
BenchmarkFmt-12          1000000            128244 ns/op         1006374 B/op          4 allocs/op
BenchmarkPlus-12         1000000             62706 ns/op          503994 B/op          1 allocs/op
BenchmarkBuilder-12     520606197                2.449 ns/op           5 B/op          0 allocs/op
PASS
ok      _/tmp/concat 194.673s
```

Interesting!

```shell
$ go1.11.13 test -bench=. -test.benchmem
goos: darwin
goarch: amd64
BenchmarkFmt-12          1000000             78188 ns/op          523073 B/op          2 allocs/op
BenchmarkPlus-12         1000000             43801 ns/op          503992 B/op          1 allocs/op
BenchmarkBuilder-12     300000000                3.35 ns/op            5 B/op          0 allocs/op
PASS
ok      _/tmp/concat     124.349s
```

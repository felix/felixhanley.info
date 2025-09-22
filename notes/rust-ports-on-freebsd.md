---
title: Rust ports on FreeBSD
keywords: [freebsd,rust]
---

Rust ports on FreeBSD is a pain, just try to avoid it.

```sh
make makesum
make extract
make cargo-crates > Makefile.crates
rm -rf ./work
make makesum
make
```

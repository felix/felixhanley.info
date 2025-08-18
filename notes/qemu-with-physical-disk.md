---
title: QEMU with physical disk
keywords: [qemu]
---

With an existing external hard disk this command boots from it:

```sh
qemu-system-x86_64 -enable-kvm -m 2048 -drive file=/dev/sda,format=raw,media=disk
```

Ensure `/dev/sda` is the correct device with boot enabled.

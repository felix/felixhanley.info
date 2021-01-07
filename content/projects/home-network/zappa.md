---
title: zappa
nested: true
tags:
- hardware
- network
- bsd
---

Main file server, downloader and jail host.

<!--more-->

Hardware:

- Gigabyte Z87N-WIFI motherboard
- Intel Core i3-4130T CPU
- 2 * Crucial 8GB RAM
- 2 Port PCIe SATA-3 controller
- 2 * Western Digital Green 2G
  - WDC WD20EFRX-68EUZN0 (ada2)
  - WDC WD20EFRX-68EUZN0 (ada3)
- 4 * Western Digital Red 3G
  - WDC WD30EZRX-22D8PB0 (ada0)
  - WDC WD30EFRX-68EUZN0 (ada1)
  - WDC WD30EFRX-68N32N0 (ada4)
  - WDC WD30EFRX-68EUZN0 (ada5)
  - WDC WD30EFRX-68EUZN0 (ada6)
- Fractal Design NODE 304 Black Mini ITX Case
- be quiet! "System Power 8" 400W Power Supply

Main software:

- [Freebsd latest RELEASE](https://freebsd.org)
- Samba
- NFSd
- Syncthing
- Jailed Postgresql (with PostGIS & TimescaleDB extensions)
- Jailed Nginx
- Jailed Prometheus & Grafana
- Jailed Transmission

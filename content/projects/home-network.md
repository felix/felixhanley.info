---
title: Home network configuration
tags:
- hardware
- network
- bsd
---

My home network is project that will probably never come to completion. This
page will be updated from time to time to reflect its current state.

<!--more-->

## Hosts

Hostnames are based on famous musicians.

## malkmus

Internet gateway and reverse proxy.

Hardware:

- PC Engines APU 2C4 system board with 4GB RAM
- M-Sata 16GB
- Compex WLE200NX miniPCI express card

Software:

- OpenBSD 6.6
- HAproxy
- Unbound
- DNSmasq
- HTTPd
- SSHd
- Tor + Privoxy

## zappa

Main file server, downloader and jail host.

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

- Freebsd 12.1-RELEASE-p3
- Samba 4.10
- NFSd
- Syncthing
- Postgresql 12
- Nginx
- Prometheus
- Transmision

## garcia

Media center and docker host.

Hardware:

- ASUS AM1B-ITX motherboard
- 2 * Samsung 4GB RAM
- Pico power supply
- M350 Fan-less case

Main software:

- Void Linux
- Kodi
- Docker

## bowie

Primary employer-supplied MacBook Pro 15" 2018 running 10.14.6 (Mojave)

MacBook

## monk

Secondary laptop.

## lennon

The family's MacBook Air.

## openwrt

Asus RT-N56U WiFi router running OpenWRT 19.07

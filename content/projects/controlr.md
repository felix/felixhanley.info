---
title: Controlr control panel
description: Ruby based hosting control panel
date: 2011-01-01
lastmod: 2011-04-21
tags:
- controlr
- ruby
---

A [Ruby on Rails](http://rubyonrails.org) based hosting control panel.

Currently a work in progress as I have the time. It is replacing the current
control panel for seconddrawer.com.au.

## Features

Currently it supports the following:

- reseller users
- domain users
- email alias configuration
- email mailbox configuration
- email alias templates per account
- dns record templates per account
- tinydns zone generation

and will eventually provide the following:

- nice easy 'wizards' to set up common configurations
- bind zone generation
- nginx config generation
- apache config generation
- client account billing
- managesieve client
- chrooted SSH configuration

## Requirements

It currently requires the following:

- postfix
- dovecot
- dovecot IMAP quota (optional)

It requires some setup to enable the configuration for each service. Examples
are given in the 'docs' folder for common setups with tinydns, dovecot and others.

## Contributions

You are more than welcome to help. The pull from the [main Controlr Git
repository](http://git.seconddrawer.com.au/controlr) or the [GitHub Controlr
mirror](http://github.com/felix/controlr). All bug reports and patches should go
through the [Controlr ticket
tracker](http://support.seconddrawer.com.au/projects/controlr).

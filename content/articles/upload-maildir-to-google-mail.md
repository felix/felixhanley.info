---
kind: article
date: 2009-05-30
title: Upload Maildir to Google Mail
keywords: IMAP, Google, mail, maildir
description: A small Ruby script to upload a Maildir to a Google GMail IMAP account.
tags:
- ruby
- google
---

I recently needed to move some clients' mail accounts to Google's GMail
hosting. I currently use Dovecot to host mail on the particular machine being
migrated and this stores the mails in a Maildir format. To migrate existing
mail stored on this server to the GMail service I wrote a little script in Ruby
to make it easier. It has the following features:

- keeps 'seen' and 'unseen' flags in place
- lets Google use the original post date
- 'flagged' messages get the 'star' in Gmail
- some basic caching
- some basic options for you to play with

It defaults to uploading the mails in to the GMail 'Inbox' but this can be
configured. This enables you to put them all into a different folder and then
sort them out from there. In GMail, IMAP folders are just 'labels'. Most other
options have sensible defaults.

Use at your own risk but if you find something wrong then please tell me. You
can get it from [my public git repository](http://git.userspace.com.au/).

---
title: Miscellaneous Scripts
description: Assorted scripts you may find useful
date: 2011-01-01
updated_at: 2012-04-04
order: 5
---

[dotfiles](http://git.seconddrawer.com.au/dotfiles/)
(all sorts) &mdash; My dotfiles.

[ogg2mp3](http://git.seconddrawer.com.au/dotfiles/tree/bin/ogg2mp3)
(shell) &mdash; Converts an Ogg file to MP3, migrating tags.

[mysendmail](http://git.seconddrawer.com.au/dotfiles/tree/bin/mysendmail)
(ruby) &mdash; A dummy sendmail script that you can point PHP to (in php.ini) that
dumps the emails with all their headers into the /tmp directory for examination.

[maildir2gmail](http://git.seconddrawer.com.au/maildir2gmail/tree/maildir2gmail)
(ruby) &mdash; A simple script to push a Maildir to a Google GMail IMAP service. It
honours seen/unseen flags, important flags, received date and has basic caching.
Written in Ruby.

[Data URL
generator](/articles/reducing-http-requests-using-data-urls-to-increase-site-performance/)
&mdash; A simple, online, data URL Generator to encode your images for use as
embedded data URLs. Scroll to the bottom of the article for the online tool.

[playlist2mp3](http://git.seconddrawer.com.au/dotfiles/tree/bin/playlist2mp3)
(shell) &mdash; Converts an M3U playlist into a collection of MP3 files, re-encoding
them from Ogg source if need be. I use this to export a saved playlist from
Music Player Deamon (MPD) to MP3 files suitable for playing on inferior hardware
that only plays MP3.

[mvln](http://git.seconddrawer.com.au/dotfiles/tree/bin/mvln) (shell) &mdash; A
really basic shell script to move a file somewhere else and then 'symlink' the
new destination to where it originally was. I use this for moving larger
torrents around while keeping them seeding but not taking up home directory
space.

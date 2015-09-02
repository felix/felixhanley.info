---
kind: article
date: 2009-04-14
title: "What's with all this encryption stuff?"
keywords: gpg gnupg pgp encryption privacy email
description: Justification for signing emails and using cryptographic software such as GnuPG and PGP.
tags:
- gnupg
---
I recently put up on this site [my GnuPG](/about/contact/) (PGP) public key and
fingerprint. Some people have asked me "that's a little over the top isn't it?"

Most people would think that encrypting everything is over the top. I agree.
But public key cryptography is not only used for encryption, it is an intrinsic
part of the ["web of trust"](http://en.wikipedia.org/wiki/Web_of_trust) that is
important both on the web and off. We trust people we have known for some time
and we usually don't initially trust people we have never met before. We will
trust them more if they are a friend of a friend etc.

In the electronic worlds we live in today, it is a lot harder to determine who
each person is exactly. That is why we block uninvited messages on MSN or
Google Talk, why most people are not fooled by spam emails (although many still
are), and many parents warn their children about indiscriminate 'chatting'
online. This is why I have begun to change my email habits. At least people
will be able to _know_ that their emails came from me.

Most people use some sort of password to send and receive their emails. This is
only one layer of security to help with your privacy. You can go one step
further and use TLS (or HTTPS in the case of webmail like Gmail), but that only
protects the message travelling from your mail client (or browser) to the
server. After that, your email can travel through a variety of networks and
machines that you have no control over. Do you know who reads your email after
you send it?

Philip Zimmermann, the creator of PGP, [likens encryption to
envelopes](http://www.philzimmermann.com/EN/essays/WhyIWrotePGP.html) when he
says that no one thinks twice about putting our letters in envelopes rather
than on postcards. It does not mean we have anything to hide, we just value our
privacy. With email, there is _no privacy_ unless you encrypt it. There is _no
proof of identity_ unless you sign it.

Read the followup post about [how to read encrypted and signed emails and how
to send your own](/articles/setting-up-email-privacy-with-mutt/).

*[PGP]: Pretty Good Privacy
*[TLS]: Transport Layer Security
*[HTTPS]: HyperText Transport Protocol Secured

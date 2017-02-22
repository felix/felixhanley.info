---
kind: article
date: 2009-04-16
title: Setting up email privacy with Mutt using GnuPG
keywords: gpg gnupg pgp encryption privacy email
description: Setting up email privacy using Mutt and GnuPG
tags:
- mutt
- gnupg
---
My last post justified my move to using privacy on my emails. This is how I
have done it using Mutt and GnuPG.

## Mutt and GnuPG

[Mutt](http://www.mutt.org/) is an email client that is console based and
allows for configuration of just about everything. It is not for everyone but I
like its simplicity and that I don't need a GUI for it to work.
[GnuPG](http://gnupg.org/) is an implementation of the
[OpenPGP](http://openpgp.org/) standard and is available on most Linux distros
and also for Windows and Mac.

1. First you need to generate your own key using GnuPG. Accepting the default
algorithm and length are usually fine. Other stuff like email and comments can
be changed later. The important part is the password. Don't make it too easy
and **don't forget it!**

        gpg --gen-key

    Later you can import more keys, revoke keys and sign other keys. For now, just your own key is enough.

2. Now setup Mutt to use your GnuPG installation. Depending on your
distribution this may already be done for you. For completeness, this is the
section of my .muttrc file that relates to GnuPG (or PGP):

        # ~/.muttrc
        source ~/.mutt/gpg

        # ~/.mutt/gpg

        # decode application/pgp
        set pgp_decode_command="gpg --status-fd=2 %?p?--passphrase-fd 0? --no-verbose --quiet --batch --output - %f"
        # verify a pgp/mime signature
        set pgp_verify_command="gpg --status-fd=2 --no-verbose --quiet --batch --output - --verify %s %f"
        # decrypt a pgp/mime attachment
        set pgp_decrypt_command="gpg --status-fd=2 %?p?--passphrase-fd 0? --no-verbose --quiet --batch --output - %f"
        # create a pgp/mime signed attachment
        set pgp_sign_command="gpg --no-verbose --batch --quiet --output - %?p?--passphrase-fd 0? --armor --detach-sign --textmode %?a?-u %a? %f"
        # create a application/pgp signed (old-style) message
        set pgp_clearsign_command="gpg --no-verbose --batch --quiet --output - %?p?--passphrase-fd 0? --armor --textmode --clearsign %?a?-u %a? %f"
        # create a pgp/mime encrypted attachment
        set pgp_encrypt_only_command="pgpewrap gpg --batch --quiet --no-verbose --output - --encrypt --textmode --armor --always-trust -- -r %r -- %f"
        # create a pgp/mime encrypted and signed attachment
        set pgp_encrypt_sign_command="pgpewrap gpg %?p?--passphrase-fd 0? --batch --quiet --no-verbose --textmode --output - --encrypt --sign %?a?-u %a? --armor --always-trust -- -r %r -- %f"
        # import a key into the public key ring
        set pgp_import_command="gpg --no-verbose --import %f"
        # export a key from the public key ring
        set pgp_export_command="gpg --no-verbose --export --armor %r"
        # verify a key
        set pgp_verify_key_command="gpg --verbose --batch --fingerprint --check-sigs %r"
        # read in the public key ring
        set pgp_list_pubring_command="gpg --no-verbose --batch --quiet --with-colons --list-keys %r" 
        # read in the secret key ring
        set pgp_list_secring_command="gpg --no-verbose --batch --quiet --with-colons --list-secret-keys %r" 
        set pgp_good_sign="^gpgv?: Good signature from "
        unset pgp_autosign
        unset pgp_autoencrypt
        set pgp_replysign
        set pgp_replyencrypt
        set pgp_verify_sig=yes
        set pgp_strict_enc
        set pgp_timeout=3600

    The first section simply defines what options I want to be applied to the calls to gpg. The final settings tell Mutt what to do with encrypted and signed emails. For instance, I want to encrypt my reply to an encrypted email etc.

3. You can also tell Mutt what key to use by default. I have several mailboxes
going in Mutt so I have done this via a folder hook. When changing into a
particular folder (or mailbox) it sets some variables.

        # ~/.muttrc
        folder-hook userspace source ~/.mutt/hook-userspace

        # ~/.mutt/hook-userspace
        set from="felix@userspace.com.au"
        set pgp_sign_as="0xD5F692E3"
        set signature=~/.signature.userspace
        my_hdr From: Felix <felix@userspace.com.au>
        my_hdr Organization: User Space, http://userspace.com.au/

    Note here the `set pgp_sign_as` setting which selects the ID for the key I
    wish to use for this account. Without folder hooks you could just place
    this in your .muttrc file.

## Thunderbird, Claws et al

Thunderbird is a graphical email client with the ability to have plugins added.
One such plugin is [Enigmail](http://enigmail.mozdev.org/home/index.php) which
does a lot of the work above for you. Easy, really.

Claws (previously Sylpheed) is another graphical client that can use plugins.
Most Linux distrobutions come with the GPG plugin already. You will need to
follow step one above to setup your GnuPG keys first though.

## Windows

Get [Thunderbird](http://www.mozillamessaging.com/)!

## Mac

I don't own a Mac but this plugin for Apple's Mail seems highly regarded:
[Sen:te's GPG for Apple
Mail](http://www.sente.ch/software/GPGMail/English.lproj/GPGMail.html).
Alternatively you could use [Thunderbird](http://www.mozillamessaging.com/) for
Mac.


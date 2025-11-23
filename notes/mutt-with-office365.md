---
title: Using Mutt with Office365
keywords: [mutt,office365]
date: 2025-11-24
---

Apparently authenticating IMAP over TLS is not good enough so we have to jump
through the multiple OAuth hoops.

## Tokens

Use the helper script that comes with neomutt at
`/usr/share/neomutt/oauth2/mutt_oauth2.py` but change it to redirect to
localhost. This fails but we can grab the code from the request.

```diff
--- /old 2025-11-24 10:12:28.187218739 +1100
+++ /new    2025-11-24 10:12:19.191166524 +1100
@@ -63,7 +63,7 @@
         'authorize_endpoint': 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
         'devicecode_endpoint': 'https://login.microsoftonline.com/common/oauth2/v2.0/devicecode',
         'token_endpoint': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
-        'redirect_uri': 'https://login.microsoftonline.com/common/oauth2/nativeclient',
+        'redirect_uri': 'http://localhost',
         'tenant': 'common',
         'imap_endpoint': 'outlook.office365.com',
         'pop_endpoint': 'outlook.office365.com',
```

Run the script to set new tokens:

```console
$ /usr/share/neomutt/oauth2/mutt_oauth2.py --authorize ~/.mutt/toennjes.tokens
```

and when asked use the `client_id` from Thunderbird
`9e5f94bc-e8a4-4e73-b8be-63364c29d753` (taken from
<https://github.com/mozilla/releases-comm-central/blob/master/mailnews/base/src/OAuth2Providers.sys.mjs#L192>)

Then things like mbsync just work like this (set in config):

```
PassCmd "/usr/share/neomutt/oauth2/mutt_oauth2.py ~/.mutt/toennjes.tokens"
```

## SMTP

To send you need the following in mutt's config:

```
set smtp_url = smtp://${imap_user}@smtp.office365.com:587
set ssl_force_tls = yes
set ssl_use_sslv3 = yes
set smtp_authenticators = 'xoauth2'
set smtp_oauth_refresh_command = "/usr/share/neomutt/oauth2/mutt_oauth2.py ~/.mutt/toennjes.tokens"
```

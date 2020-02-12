---
kind: article
date: 2009-10-02
title: Custom keyboard layout in Xorg
keywords: keyboard lahu xorg xkb Linux
description: A way to easily customise your keyboard in Linux
tags:
- lahu
- keyboard
---

For most languages there is already a keyboard layout you can use to enter the
unique characters for that language. There is no such thing for
[Lahu](http://lahu.felixhanley.info) This has led me to create my own keyboard
mapping to enable me to enter the various tone marks required in Lahu.
Previously I had not bothered to learn how to do it properly and had been
installing this keyboard map system wide. This has meant that changes were
being lost each time the system was updated (often in Archlinux) and became
fustrating. So while this is how I have done it for the Lahu language, it could
easily be adjusted for any other special keyboard requirements.

## Create your custom key map

Looking through the files under /usr/share/X/xkb/rules should give you an idea
of how a keyboard map can be defined. You can either define an entier map
(tedious and probably unnecessary) or simply inerit all the part you want and
then adjust the bits you want changed. This is what I did for the Lahu
keyboard. All I wanted to change were three keys which was six characters.

    partial default alphanumeric_keys
    xkb_symbols "basic" {

        // adds the Lahu tone characters to the basic keyboard

        include "latin"

        name[Group1]= "Lahu";

        key <AD11> { [ UF1E7,  U02C6,  bracketleft,   braceleft  ] };
        key <AD12> { [ U02EC,  U02C7,  bracketright,  braceright ] };
        key <BKSL> { [ U02CD,  U02C9,  backslash,     brokenbar  ] };

        include "level3(ralt_switch_multikey)"
    };

Notice I declare this rule file as a 'partial' and the areas it will affect,
'default' and 'alphanumeric_keys'. Further down I include the latin rule file
which is essentially the default US keyboard mapping.

Next it is just a matter of defining the keys and their corresponding codes for
normal keypress, shifted etc. I simply moved the default to the 3rd and 4th
level modified keystroke so that they were there if needed (never used them
though). These are accessed by the right 'Alt' key as indicated. Have a look at
some other keyboard rule files to get a feel for it.

The codes we are interested in are UF1E7, U02EC, U02CD, U02C6, U02C7 &amp;
U02C9. To see the characters they correspond to see the [page on
Lahu](/projects/lahu/).

## Loading your keyboard rules

This is where I finally changed my ways. No need to load this map system wide,
use the _setxbkmap_ and _xkbcomp_ commands to load it into the current X
session.

setxkbmap can set the keyboard and other options using provided rules files.
Firstly we need to make sure it knows where to find things. In your home
directory create a folder to hold things. Within this folder you need to create
the subfolder 'symbols' which is where you place the rule file above. This is
where xkbcomp will expect to find the rule file.

Then it is simply a matter of constructing the command to load and compile your
rules file. My command is:

    setxkbmap -I$HOME/.xkb -option grp:shifts_toggle,grp_led:scroll "us,th,lah" -print | xkbcomp -I$HOME/.xkb - $DISPLAY

There are two parts to this, the first part sets the options for the X session
by defining the two shift keys pressed together as the keyboard map toggle
combination. It also sets the maps I wish to toggle between (US, Thai and my
own Lahu). The output of this command is a short configuration that the
keyboard compiler _xkbcomp_ can read.

The second part of that command tells xkbcomp to load the configuration passed
to it into the currently running X server. It will try to find the 'lah' rule
file in the folder structure created previously.

## Load it on start up

Once this is tested and working it is easy enough to load this in your .xinitrc
or .Xsession file before running your window manager. You should then be able
to toggle your keyboard maps by using the two shift keys together with the
scroll lock LED indicating the change.

This setup will not be wiped with X server changes and is a lot easier to keep
track of than a system wide hack.


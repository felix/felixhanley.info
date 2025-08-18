---
date: 2009-10-02
title: Custom keyboard layout in Xorg
keywords: [keyboard,xorg]
description: Custom your keyboard layout
---

For most languages there is already a keyboard layout you can use to enter the
unique characters for that language. There is no such thing for
[Lahu](http://lahu.felixhanley.info) so we need a custom xorg keyboard map.

## Create your custom key map

You can either define an entire map (tedious and probably unnecessary) or simply 
inherit all the part you want and then adjust the bits you want changed.

```xorg
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
```

This rule file is a 'partial', including the latin rule file which is essentially the default US keyboard mapping.

The keys are defined for 'normal' keypress, shifted etc. They are accessed by 
the right 'Alt' key as indicated.

The codes we are interested in are UF1E7, U02EC, U02CD, U02C6, U02C7 &amp;
U02C9. To see the characters they correspond to see the [page on
Lahu](/projects/lahu/).

## Loading your keyboard rules

No need to load this map system wide, use the _setxbkmap_ and _xkbcomp_ commands 
to load it into the current X session. Stick it in ~/.xinitrc or ~/.Xsession

```shell
setxkbmap -I$HOME/.xkb -option grp:shifts_toggle,grp_led:scroll "us,th,lah" -print | xkbcomp -I$HOME/.xkb - $DISPLAY
```

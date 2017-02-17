---
title: Lahu Keyboard
linktitle: Keyboard
description: How to install a Lahu language keyboard layout in Linux and Windows.
date: 2011-01-04
lastmod: 2016-01-25
tags:
- lahu
- unicode
- font
menu:
  main:
    parent: lahu
---

The Lahu language uses various tone marks that are difficult to use with
a standard keyboard layout.

<!--more-->

The keyboards for Linux/Unix and Windows below will have the following
mappings:

\[ = <span class="lahu">ꞈ</span> (Unicode U+A788)  
\] = <span class="lahu">ˬ</span> (Unicode U+02EC)  
\\ = <span class="lahu">ˍ</span> (Unicode U+02CD)  
\{ = <span class="lahu">ˆ</span> (Unicode U+02C6)  
\} = <span class="lahu">ˇ</span> (Unicode U+02C7)  
\| = <span class="lahu">ˉ</span> (Unicode U+02C9)

Hopefully the pattern should be clear. Note, to see the correct
characters you will need to have a recent Unicode font installed.

There are two ways to install your own keyboard map in Linux, globally and per
user (locally).

## Local Custom Keyboard Map

### Create your custom key map

Looking through the files under /usr/share/X/xkb/rules should give you an idea
of how a keyboard map can be defined. You can either define an entire map
(tedious and probably unnecessary) or simply inerit all the part you want and
then adjust the bits you want changed. This is a method to create a Lahu
keyboard. All we need to change are three keys which is six characters.

~~~
partial default alphanumeric_keys
xkb_symbols "basic" {

    // adds the Lahu tone characters to the basic keyboard

    include "latin"

    name[Group1]= "Lahu";

    key <AD11> { [ UA788,  U02C6,  bracketleft,   braceleft  ] };
    key <AD12> { [ U02EC,  U02C7,  bracketright,  braceright ] };
    key <BKSL> { [ U02CD,  U02C9,  backslash,     brokenbar  ] };

    include "level3(ralt_switch_multikey)"
};
~~~

Notice we declare this rule file as a 'partial' and the areas it will affect,
'default' and 'alphanumeric_keys'. Further down we include the latin rule file
which is essentially the default US keyboard mapping.

Next it is just a matter of defining the keys and their corresponding codes for
normal keypress, shifted etc. We simply move the default to the 3rd and 4th
level modified keystroke so that they were there if needed. These are accessed
by the right 'Alt' key as indicated. Have a look at some other keyboard rule
files to get a feel for it.

The codes we are interested in are UA788, U02EC, U02CD, U02C6, U02C7 &amp;
U02C9. To see the characters they correspond to see the [page on
Lahu](/projects/lahu/).

### Loading your keyboard rules

Here we use the _setxbkmap_ and _xkbcomp_ commands to load it into the current X
session.

setxkbmap can set the keyboard and other options using provided rules files.
Firstly we need to make sure it knows where to find things. In your home
directory create a folder to hold things. Within this folder you need to create
the subfolder 'symbols' which is where you place the rule file above. This is
where xkbcomp will expect to find the rule file.

Then it is simply a matter of constructing the command to load and compile your
rules file. An example is:

~~~ bash
setxkbmap -I$HOME/.xkb -option grp:shifts_toggle,grp_led:scroll "us,th,lhu" -print | xkbcomp -I$HOME/.xkb - $DISPLAY
~~~

There are two parts to this, the first part sets the options for the X session
by defining the two shift keys pressed together as the keyboard map toggle
combination. It also sets the maps we wish to toggle between (US, Thai and our
own Lahu). The output of this command is a short configuration that the
keyboard compiler _xkbcomp_ can read.

The second part of that command tells xkbcomp to load the configuration passed
to it into the currently running X server. It will try to find the 'lhu' rule
file in the folder structure created previously.

### Load it on start up

Once this is tested and working it is easy enough to load this in your .xinitrc
or .Xsession file before running your window manager. You should then be able
to toggle your keyboard maps by using the two shift keys together with the
scroll lock LED indicating the change.


## Global (system wide) Instructions

* Copy the [Lahu keyboard layout file](/files/lhu.txt) into
'/usr/share/X11/xkb/symbols/', naming it 'lhu' . This is where the layout of
the key symbols is defined. It is simply a copy of one of the layouts in the
'us' symbol file with the necessary changes.

* In the '/usr/share/X11/xkb/rules/' directory, edit the 'xorg.lst' file.
Find the 'layout' section and add a line as follows:

        lhu  Lahu

'lhu' refers to the filename you created in step 1

* Also in '/usr/share/X11/xkb/rules/', edit the 'xorg.xml' file. Find the
last 'layout' definition (search for '/layoutlist', insert before this) and
create a new layout definition with the following:

~~~xml
<layout>
  <configItem>
    <name>lhu</name>
    <shortDescription>Lahu</shortDescription>
    <description>Lahu</description>
  </configItem>
</layout>
~~~

Note that the 'name' should be the same as the file created in step 1.

* You can then setup your window manager to use the Lahu keyboard layout.
There is usually some little toolbar icon you can configure for this too.  If
you are using something out of the ordinary then try the following which uses
the 'menu' key to toggle the language:

~~~bash
setxkbmap  -option grp:menu_toggle,grp_led:scroll "us,lhu"
~~~

The files used above can be found in [the Github
repository](https://github.com/felix/xkb-lahu/).

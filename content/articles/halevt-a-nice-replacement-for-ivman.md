---
kind: article
date: 2009-03-20
title: Halevt, a nice replacement for ivman
keywords: archlinux halevt
description: Helevt is a nice HAL event daemon replacement for ivman, now available in Archlinux
tags:
- halevt
- archlinux
---
I recently found time to start using
[halevt](http://www.environnement.ens.fr/perso/dumas/halevt.html) on my local
machines as a replacement for ivman, automount etc. It has only one major
dependency and is quite simple to setup. Liking it so much I also added it to
the [Archlinux](http://archlinux.org) AUR repository. You can find the [halevt
PKGBUILD](http://aur.archlinux.org/packages.php?ID=24244) there.

There is no real need to configure it out of the box but a few tweaks may be
necessary. I personally needed to have shortname options set for vfat volumes
and UTF-8 encoding aswell. You can use the built in halevt-mount command to do
the mounting via HAL or whatever you would like ie. pmount.

You can also use halevt to respond to HAL events. In my particular
configuration I display a notification in
[Awesome](http://awesome.naquadah.org/) that a new volume is mounted.

Simple create your own configuration XML file in ~/.halevt/config.xml and the
daemon should pick it up. Here is my current configuration (though it is
changing constantly):

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE halevt:Configuration [
    <!ENTITY MOUNTABLE "hal.block.device &amp; hal.block.is_volume = true &amp; 
      (hal.volume.policy.should_mount = true | ((! hal.volume.policy.should_mount = false) &amp; 
      (hal.block.storage_device.hal.storage.policy.should_mount = true | 
        ((! hal.block.storage_device.hal.storage.policy.should_mount = false)  &amp;
        (hal.block.storage_device.hal.storage.hotpluggable = true | 
        hal.block.storage_device.hal.storage.removable = true)))))">
    ]>

    <halevt:Configuration version="0.1" xmlns:halevt="http://www.environnement.ens.fr/perso/dumas/halevt.html">
      <!-- device init -->
      <halevt:Device match="&MOUNTABLE; &amp; hal.volume.is_mounted = false">
        <halevt:OnInit exec="halevt-mount -u $hal.udi$ -o sync -o shortname=mixed,utf8 -m 002"/>
      </halevt:Device>

      <!-- insertion and removal -->
      <halevt:Device match="&MOUNTABLE;">
        <halevt:Insertion exec="halevt-mount -u $hal.udi$ -o sync -o shortname=mixed,utf8 -m 002"/>
      </halevt:Device>

      <halevt:Device match="&MOUNTABLE;">
        <halevt:Removal exec="halevt-umount -d $hal.block.device$"/>
      </halevt:Device>

      <halevt:Device match="hal.storage.removable = true">
        <halevt:Condition name="EjectPressed" exec="halevt-mount -r -d /dev/sr0; eject"/>
      </halevt:Device>

      <!-- property changes -->
      <halevt:Device match="&MOUNTABLE;">

        <!-- when mounted or removed -->
        <halevt:Property name="hal.volume.is_mounted">
          <halevt:Action value="true" exec="echo &quot;naughty.notify({timeout=15, title='New Volume', text='$hal.info.vendor$ $hal.info.product$ $hal.storage.size$'})&quot; | awesome-client -" />
          <halevt:Action value="false" exec="echo &quot;naughty.notify({timeout=15, title='Volume Removed', text='$hal.info.vendor$ $hal.info.product$ $hal.storage.size$'})&quot; | awesome-client -" />
        </halevt:Property>

        <!-- is locked -->
        <halevt:Property name="hal.info.locked">
          <halevt:Action value="true" exec="echo &quot;naughty.notify({timeout=15, title='Volume Locked', text='$hal.info.vendor$ $hal.info.product$ $hal.storage.size$\n$info.locked.reason$\n$hal.info.udi$'})&quot; | awesome-client -" />
          <halevt:Action value="false" exec="echo &quot;naughty.notify({timeout=15, title='Volume Un-locked', text='$hal.info.vendor$ $hal.info.product$ $hal.storage.size$\n$hal.info.udi$'})&quot; | awesome-client -" />
        </halevt:Property>

      </halevt:Device>
    </halevt:Configuration>

*[HAL]: Hardware Abstraction Library

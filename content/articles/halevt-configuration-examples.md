---
kind: article
date: 2010-01-02
title: Halevt configuration examples
description: Some configuration examples for the HAL event daemon, Halevt
tags:
- halevt
---
I am the Archlinux packager for Halevt (currently in AUR, but with
growing votes). It is a nice replacement for other HAL event based
daemons such as ivman. I have been using it for the last couple of years
with no issues.

I get a lot of searches on this site for halevt and configuration
examples so I thought I would collect some of the snippets from the
mailing list and other sources and put them here together. Some of these
are [now in the
source](http://cvs.savannah.gnu.org/viewvc/halevt/halevt/examples/)

I hope I attribute authorship correctly, let me know if I have missed an
example or credit. Remember to use XML entities for '&' and quotes!

- [Notifications](#notifications)
- [Mounting](#mounting)

## Notifications

_Marcin Gryszkalis_:

    <halevt:Device
      match="hal.info.category = printer | hal.info.category = scanner ">
      <halevt:Insertion exec="/bin/popper -n -5
        '$hal.info.category$ detected'
        'Connected $hal.info.vendor$ $hal.info.product$'
        '/usr/share/icons/nuvola/64x64/devices/printer.png'"
        />
    </halevt:Device>

    <halevt:Device
      match="hal.info.category = printer | hal.info.category = scanner">
      <halevt:Removal exec="/bin/popper -n -5
        '$hal.info.category$ removed'
        'Removed $hal.info.vendor$ $hal.info.product$'
        '/usr/share/icons/nuvola/64x64/devices/printer.png'"
        />
    </halevt:Device>

    <halevt:Device match="hal.volume.is_disc = true &amp; hal.volume.disc.is_blank
      = true">
      <halevt:Insertion
        exec="/bin/popper -n -5
        'Empty disc'
        'This disc is empty ($hal.volume.disc.type$)'
        '/usr/share/icons/nuvola/64x64/devices/cdwriter_unmount.png'" 
        />
    </halevt:Device>

/bin/popper is from http://phospher.com/index.php/Popper

I personally have the following for use with the Awesome window manager
to provide popup notifications on new mounts:

    <halevt:Device match="&MOUNTABLE;">
      <!-- when mounted or removed -->
      <halevt:Property name="hal.volume.is_mounted">
        <halevt:Action value="true" exec="echo &quot;naughty.notify({timeout=15, title='New Volume', text='$hal.info.vendor$ $hal.info.product$ $hal.storage.size$'})&quot; | awesome-client -" />
        <halevt:Action value="false" exec="echo &quot;naughty.notify({timeout=15, title='Volume Removed', text='$hal.info.vendor$ $hal.info.product$ $hal.storage.size$'})&quot; | awesome-client -" />
      </halevt:Property>
    </halevt:Device>

## Mounting

_Marcin Gryszkalis_, to create mount points from labels:

    <match key="volume.label" empty="false">
      <match key="volume.label" is_absolute_path="false">
        <merge key="volume.policy.desired_mount_point"
          type="copy_property">volume.label</merge>
        </match>
    </match>

and then in halevt config:

    <halevt:Device match="&MOUNTABLE;">
      <halevt:Insertion
      exec="halevt-mount -u $hal.udi$ -o sync -p
      $hal.volume.policy.desired_mount_point$ -m 002"
      />
    </halevt:Device>

To unmount and eject CDROMS (adjust device name):

    <halevt:Device match="&DISC;">
      <halevt:Condition name="EjectPressed" exec="halevt-mount -r -d /dev/sr0; eject"/>
    </halevt:Device>

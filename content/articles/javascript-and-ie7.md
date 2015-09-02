---
kind: article
date: 2009-11-26
title: Javascript and IE7
keywords: javascript internet explorer ie7
description: A little bug that affects Internet Explorer 7
tags:
- javascript
---
Just a quick post. Something to look for with Internet Explorer 7 and
Javascript (not JQuery specifically). The following will work fine in IE8, FF
and even IE6, but _not_ IE7:

    $("#foo").validate({
        rules: {
          firstname: 'required',
          lastname: 'required',
          phone: 'required',
          email: {required:true,email:true},
          street: 'required',
          city: 'required',
          state: 'required',
          postcode: 'required',
          service_areas: 'required',
        }
      });

Whereas _this_ will:

    $("#foo").validate({
        rules: {
          firstname: 'required',
          lastname: 'required',
          phone: 'required',
          email: {required:true,email:true},
          street: 'required',
          city: 'required',
          state: 'required',
          postcode: 'required',
          service_areas: 'required'
        }
      });

Spot the difference? That single comma after the last rule hash. That will stop
IE7 from processing Javascript and result in your other events not getting
fired.


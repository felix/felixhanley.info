---
kind: article
date: 2009-07-13
title: Site translation using jQuery and Google
keywords: jQuery Google translate translation javascript
description: How to set up site translation using jQuery, Google and the jquery-translate plugin
tags:
- jquery
- google
---
This is just a little plug for the [jQuery](http://jquery.com/) plugin
'[jquery-translate](http://code.google.com/p/jquery-translate/)' by Balazs
Endresz. It utilises the translation functions of Google's AJAX language API
and is very easy to integrate into your site.

Without going into all the details of how it can be used (you can have progress
bars etc.) I thought I would just show how it is used on this site.

    function translateTo( destLang ){                  
      $('body').translate(
          'english', 
          destLang, 
          {not: '#menu, pre, .jq-translate-ui', fromOriginal:true}
          )
    }

    $(document).ready(function(){

      /*--- snip ---*/

      //when the Google Language API is loaded
      $.translate(function(){ 
        // clear the loading gif
        $('#translate').empty();
        //generate dropdown
        $.translate.ui('select', 'option') 
        // when selecting another language
        .change(function(){
          var lang = $(this).val();
          translateTo(lang);
          $.cookie('destLang', lang, {path:'/', domain:'www.userspace.com.au'});
          })
        .val('English') //select English as default
        .appendTo('#translate'); //insert the dropdown to the page

        //insert Google's logo after the dropdown:
        $.translate.getBranding().appendTo($('#translate'));

        //get previously translated language      
        var destLang = $.cookie('destLang'); 
        if (destLang && destLang != 'English') {
        $('.jq-translate-ui').val(destLang);
        translateTo( destLang );
        }
      });
    });

First, the above code defines a function that I use for calling the plugin's
translate function. It simply defines a couple of DOM elements that I don't
want translated such as code blocks and the translation drop-down itself.

When the document is ready for playing with, I do some visual cleanups and then
create the drop-down list by using jquery-translate's 'ui' function, defining a
function to be called when it changes. I have chosen to always have the page
translated from the original English version and I believe the Google branding
is required too! I am also using a cookie plugin to remember settings between
pages.

What the plugin does is simply chop up your page or the sections you choose and
sends the text off to Google for translation. It keeps track of where it should
be placed once it returns and also how much data to send at once to keep the
Google API happy too.

So for a simple way to provide many translations of your pages (with the
translations getting better as time goes on) this is one of your options.
Thanks to Balazs, my many Russian and German visitors are hopefully able to
understand me a little better! 

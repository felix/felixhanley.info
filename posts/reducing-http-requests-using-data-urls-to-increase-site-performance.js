$(document).ready(function(){
  $.getScript('/js/jquery.form.min.js', function(){
    $('#data-url-loading').hide();
    $('#data-url-submit').attr('disabled','');
    $('#data-url').ajaxForm({
      target: '#data-url-response',
      beforeSubmit: function(){
        $('#data-url-loading').show();
      },
      success: function(){
        $('#data-url-loading').hide();
        $('#data-url-response').show();
      }
    });
  });
});

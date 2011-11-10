$(document).ready( function($) {

  $('fieldset.submit input').click( function() {
    var gender = $('input.gender:checked').val();
    var salutation = ( gender == 'female' ? 'Ms.' : 'Mr.' );
    var name = $('#first-name').val() + " " + $('#last-name').val();
    var greeting = "Hello there " + salutation + " " + name;
    $('.hello').text(greeting).show();
    return false;
  })

});
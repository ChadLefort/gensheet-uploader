/* Bootstrap Form Validation
 ----------------------------------------------------------------------------------------*/
$('#gensheetUploader').bootstrapValidator({
  message: 'This value is not valid',
  fields: {
    hullNumber: {
      message: 'That hull number is not valid',
      validators: {
        notEmpty: {
          message: 'Is required and cannot be empty'
        },
        integer: {
          message: 'The value is not an integer'
        },
        remote: {
          url: '/validate/',
          data: function(validator) {
            return {
              hullNumber: validator.getFieldElements('hullNumber').val()
            };
          },
          message: 'That hull number is not available'
        }
      }
    },
    hullName: {
      message: 'The hull name is not valid',
      validators: {
        stringLength: {
          min: 3,
          max: 30,
          message: 'Must be between 3 and 30 characters long'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_ -]+$/,
          message: 'Can only consist of alphabetical, number, dash, and underscore'
        },
        remote: {
          url: '/validate/',
          data: function(validator) {
            return {
              hullName: validator.getFieldElements('hullName').val()
            };
          },
          message: 'That hull name is not available'
        }
      }
    },
    gensheet: {
      validators: {
        notEmpty: {
          message: 'Is required and cannot be empty'
        },
        file: {
          extension: 'xlsm,xls,csv',
          type: 'application/vnd.ms-excel.sheet.macroenabled.12,application/vnd.ms-excel,text/csv',
          maxSize: 10240 * 1024, // 10 MB
          message: 'The selected file is not valid'
        }
      }
    },
    image: {
      validators: {
        file: {
          extension: 'jpg,jpeg,png,bmp,gif',
          type: 'image/jpg,image/jpeg,image/png,image/bmp,image/gif',
          maxSize: 5120 * 1024, // 5 MB
          message: 'The selected file is not valid'
        }
      }
    }
  }
});

$('#search').bootstrapValidator({
  message: 'This value is not valid',
  fields: {
    typeahead: {
      message: 'That search is not valid',
      validators: {
        notEmpty: {
          message: 'Please enter a search term'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_ -]+$/,
          message: 'Searches can only consist of alphabetical, number, dash, and underscore'
        }
      }
    }
  }
});

/* Typeahead
 ----------------------------------------------------------------------------------------*/
$('input.typeahead').typeahead({
  name: 'typeahead',
  remote: '/database/typeahead?key=%QUERY',
  limit: 10
});

/* CSRF Ajax Headers
 ----------------------------------------------------------------------------------------*/
$(function() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });
});

/* Scroll up arrow
 ----------------------------------------------------------------------------------------*/
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $('.scrollup').fadeIn();
  } else {
    $('.scrollup').fadeOut();
  }
});

$('.scrollup').click(function() {
  $("html, body").animate({
    scrollTop: 0
  }, 600);
  return false;
});

/* Gensheet table double scroll
 ----------------------------------------------------------------------------------------*/
$(function() {
  $('.scrollable1').on('scroll', function(e) {
    $('.scrollable2').scrollLeft($('.scrollable1').scrollLeft());
  });
  $('.scrollable2').on('scroll', function(e) {
    $('.scrollable1').scrollLeft($('.scrollable2').scrollLeft());
  });
});
$(window).on('load', function(e) {
  $('.bar1').width($('table').width());
  $('.bar2').width($('table').width());
});

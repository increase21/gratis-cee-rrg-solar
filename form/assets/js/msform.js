$(document).ready(() => {
   //jQuery time
   var current_fs, next_fs, previous_fs //fieldsets
   var left, opacity, scale; //fieldset properties which we will animate
   var animating; //flag to prevent quick multi-click glitches
   let index_fs = 0

   function doNext(e) {
      if (animating) return false;
      animating = true;

      current_fs = $(e).parent();
      next_fs = $(e).parent().next();

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({ opacity: 0 }, {
         step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
               'transform': 'scale(' + scale + ')',
               'position': 'absolute'
            });
            next_fs.css({
               'left': left,
               'opacity': opacity,
               'position': 'relative'
            });
         },
         duration: 800,
         complete: function () {
            current_fs.hide();
            animating = false;
            index_fs++
         },
         //this comes from the custom easing plugin
         easing: 'easeInOutBack'
      });
   }

   function doPrev(e) {
      if (index_fs === 0) return
      if (animating) return false;
      animating = true;
      current_fs = $(`fieldset:eq(${index_fs})`);
      previous_fs = $(current_fs).prev();

      //de-activate current step on progressbar
      // index_fs = $("fieldset").index(current_fs)
      $(`#progressbar li:eq(${index_fs})`).removeClass("active");
      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({ opacity: 0 }, {
         step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
               'left': left,
               'position': 'relative'
            });
            previous_fs.css({
               'transform': 'scale(' + scale + ')',
               'opacity': opacity,
               'position': 'absolute'
            });
         },
         duration: 800,
         complete: function () {
            current_fs.hide();
            current_fs.css({
               'position': 'absolute'
            });
            previous_fs.css({
               'position': 'relative'
            });
            animating = false;
            index_fs--
         },
         //this comes from the custom easing plugin
         easing: 'easeInOutBack',
      });

   }

   function doZipLookup() {
      var zipcode = $('#zip').val();

      $.ajax({
         type: "GET",
         url: 'https://api.zippopotam.us/us/' + zipcode,
         dataType: 'json',
         beforeSend: function () {
            // nothing
         }
      })
         .done(function (data) {

            //console.log( "second success" );
            var geodata = data['places'];
            var city = geodata[0]['place name'];
            var state = geodata[0]['state abbreviation'];
            $('#city').val(city);
            $('#state').val(state);

            // get the locat providers
            var $select = $('#currentProvider');
            $.getJSON('https://api.imgleads.com/data/9-current_provider.ashx?stateAbb=' + state, function (data) {
               $select.html('');
               $select.append('<option value="">Current Power Company</option>');
               $.each(data.currentProvider, function (key, val) {
                  $select.append('<option value="' + val.name + '">' + val.name + '</option>');
               });
            });

         })
         .fail(function (jqXHr, textStatus, errorThrown) {
            //console.log( "error" );
            alert('Invalid Zip Code.');
         })
         .always(function () {
            //console.log( "complete" );
         });
   }

   $('#zip').on('blur', function () {
      doZipLookup();
   });


   $('#step1').on('click', function (e) {


      var form = $('#msform');

      doZipLookup();

      form.validate({
         rules: {
            address: "required",
            zip: "required",
            email: {
               required: true,
               email: true,
               remote: {
                  crossDomain: true,
                  message: 'Invalid email',
                  url: 'https://api.imgleads.com/data/verify-email.ashx',
                  name: 'email',
                  threshold: 4
               }
            },
            propertyType: "required"
         },
         messages: {
            address: '<i class="fa fa-times-circle"></i>',
            zip: '<i class="fa fa-times-circle"></i>',
            email: '<i class="fa fa-times-circle"></i>',
            propertyType: '<i class="fa fa-times-circle"></i>'
         }
      });

      if (form.valid() == true) {
         var evt = e || window.event;
         if (evt.preventDefault) {
            evt.preventDefault();
         } else {
            evt.returnValue = false;
            evt.cancelBubble = true;
         }

         var sFormWindow = window.open('/index2.php?' + $('#msform').serialize());

         form.submit();
      }

   });

   $("#next1").click(function () {

      var form = $('#msform');

      doZipLookup();

      form.validate({
         rules: {
            address: "required",
            zip: "required",
            email: {
               required: true,
               email: true,
               remote: {
                  crossDomain: true,
                  message: 'Invalid email',
                  url: 'https://api.imgleads.com/data/verify-email.ashx',
                  name: 'email',
                  threshold: 4
               }
            },
            propertyType: "required",
            authorizeChange: "required"
         },
         messages: {
            address: '<i class="fa fa-times-circle"></i>',
            zip: '<i class="fa fa-times-circle"></i>',
            email: '<i class="fa fa-times-circle"></i>',
            propertyType: '<i class="fa fa-times-circle"></i>',
            authorizeChange: '<i class="fa fa-times-circle"></i>'
         }
      });

      if (form.valid() == true) {
         doNext(this);
      }

   });

   $("#next2").click(function () {

      var form = $('#msform');

      form.validate({
         rules: {
            propertyType: "required",
            roofShade: "required",
            monthlyBill: "required",
            currentProvider: "required",
            leadid_tcpa_disclosure: "required"
         },
         messages: {
            roofShade: '<i class="fa fa-times-circle"></i>',
            monthlyBill: '<i class="fa fa-times-circle"></i>',
            currentProvider: '<i class="fa fa-times-circle"></i>',
            leadid_tcpa_disclosure: '!'
         }
      });

      if (form.valid() == true) {
         doNext(this);
      }

   });
   // bring the previous form
   $("body").on('click', '.active', (e) => {
      e.preventDefault()
      e.stopImmediatePropagation()
      doPrev()
   });
})




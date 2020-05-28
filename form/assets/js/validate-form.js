
// Field Masks
$("#phonePrimary").mask("(999) 999-9999", { placeholder: "  " });
$("#zip").mask("99999", { placeholder: " " });

// Form validation
$("#msform").validate({
   //	errorPlacement: function(){
   //		return false;  // suppresses error message text
   //	},
   rules: {
      firstName: "required",
      lastName: "required",
      address: "required",
      city: "required",
      state: "required",
      zip: "required",
      country: "required",
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
      phonePrimary: {
         required: true,
         remote: {
            crossDomain: true,
            message: 'Invalid Phone',
            url: 'https://api.imgleads.com/data/verify-phone.ashx',
            name: 'phone',
            threshold: 4,
            data: {
               phone: function () {
                  return $("#phonePrimary").val();
               }
            }
         }
      },
      homeOwner: "required",
      propertyType: "required",
      monthlyBill: "required",
      currentProvider: "required",
      roofType: "required",
      roofShade: "required",
      creditRating: "required",
      projectStatus: "required",
      timeFrame: "required",
      leadid_tcpa_disclosure: "required",
      authorizeChange: "required"
   },
   messages: {
      firstName: '<i class="fa fa-times-circle"></i>',
      country: '<i class="fa fa-times-circle"></i>',
      lastName: '<i class="fa fa-times-circle"></i>',
      address: '<i class="fa fa-times-circle"></i>',
      city: '<i class="fa fa-times-circle"></i>',
      state: '<i class="fa fa-times-circle"></i>',
      zip: '<i class="fa fa-times-circle"></i>',
      email: '<i class="fa fa-times-circle"></i>',
      homeOwner: '<i class="fa fa-times-circle"></i>',
      phonePrimary: '<i class="fa fa-times-circle"></i>',
      propertyType: '<i class="fa fa-times-circle"></i>',
      monthlyBill: '<i class="fa fa-times-circle"></i>',
      currentProvider: '<i class="fa fa-times-circle"></i>',
      roofType: '<i class="fa fa-times-circle"></i>',
      roofShade: '<i class="fa fa-times-circle"></i>',
      creditRating: '<i class="fa fa-times-circle"></i>',
      projectStatus: '<i class="fa fa-times-circle"></i>',
      timeFrame: '<i class="fa fa-times-circle"></i>',
      authorizeChange: '<i class="fa fa-times-circle"></i>',
      leadid_tcpa_disclosure: '!'
   }
});


$('#submitButton').on('click', async (e) => {
   e.preventDefault()
   e.stopImmediatePropagation()

   enrollForm1 = $('#msform');

   enrollForm1.validate();

   if (enrollForm1.valid()) {
      $('#submitButton').prop('disabled', true)
      // DO IP LOOKUP ON ZIP CODE BEFORE SUBMITTING
      let zip = $("#zip").val().trim()
      let domainR = ['127.0.0', 'localhost'].indexOf(location.origin) > -1 ? "/_vanila/gratis/solar-high-others/zipcode.php" : "/rgr-solar/zipcode.php"
      $.ajax({
         url: domainR,
         method: "POST",
         data: `zip=${zip}`
      }).done(e => {
         if (e.status === "yes") {
            SendLead(true, null) //send to Highrolers
         } else {
            SendLead(null, true) //send to rgr 
         }
      })
   }
   else {
      $('html, body').animate({
         scrollTop: $('.error').first().offset().top - 120
      }, 500);
      $('.error').first().find('input').focus();
   }
})

// close the modal once the close btn is clicked
$('body').on('click', '.modal-btn', function () {
   window.close()
})


const SendLead = async (highRoller, RGR) => {
   // Do IP Address Lookup
   if (RGR && RGR === true) {
      let userIp = await $.getJSON('https://api.ipdata.co/?api-key=d4b2ec5cd9239b7b126259f0b012f352754ba15ad2ab4e61f23cf748');
      // get the Leadid
      let Leadid = $('#leadid_token').val()
      // get the URL
      let originURL = location.href
      // Live
      var url = "https://gratisdigital.listflex.com/lmadmin/api/leadimport.php?";
      // get all the form inputs
      // Live Params
      var formData = $('#msform').serialize();
      formData += `&apikey=JMNCAVYJ2A47D8V9DPX5&list_id=1696&cust_field_116=${Leadid}&ip=${userIp.ip}&city=${userIp.city}&state=${userIp.region_code}&offer=${originURL}`
      // Test Params
      // formData += `&apikey=P7IYXSYHAIFMBQ94FPD&list_id=1697&cust_field_116=${Leadid}&ip=${userIp.ip}&city=${userIp.city}&state=${userIp.region_code}&offer=${originURL}`
      // append the form input with the url
      var RGRURL = url + formData
      // Fire Facebook Pixel for registration
   } else if (highRoller && highRoller === true) {
      let fname = $("#firstName").val().trim()
      let lname = $("#lastName").val().trim()
      let email = $("#email").val().trim()
      let phone = $("#phonePrimary").val().trim()
      let addr = $("#address").val().trim()
      let zip = $("#zip").val().trim()
      var formData = `fname=${fname}&lname=${lname}&email=${email}&phone=${phone}&addr=${addr}&zip=${zip}`
      var highRollerURL = 'https://hooks.zapier.com/hooks/catch/2128931/oi3swwa'
   } else {
      return
   }

   dataLayer.push({ 'event': 'CompleteRegistration' });
   // data to send out
   let sendData = {
      type: highRoller ? "POST" : "GET",
      url: highRoller ? highRollerURL : RGRURL,
      // dataType: 'json',
      beforeSend: function () {
         // Disable the button and Open the Modal dialog to show Processing....
         $('#signupButton').attr('disabled', 'disabled');
         $('#modalProcessing').modal({ backdrop: 'static', keyboard: false });
      }
   }
   // add the form data if high rollers
   if (highRoller === true) {
      sendData.data = formData
   }
   // submit to the database
   $.ajax(sendData)
      .done(function (data) {
         if (data === 'Success' || data.status === "success") {
            $('.modal-dynamic-content').html(textSuccess)
         } else {
            $('.modal-dynamic-content').html(textFail)
         }
      })
      .fail(function (jqXHr, textStatus, errorThrown) {
         // show an error message
         $('#modalProcessing').modal('toggle');
         $('#errorContainer').css('display', 'block');
         $('#errorMessage').html('We\'re sorry, an error occurred. Please try again in a few minutes.');
      })
      .always(function () {
         $('#signupButton').removeAttr('disabled');
      });
}

// for success message
const textSuccess = `<div><h2 class="green-text">THANK YOU FOR YOUR REQUEST</h2>
      <h4 class="mt-3">One of our agents will contact your shortly</h4>
      <p><button class="btn mt-2 bg-green white-text modal-btn">Close</button>
      </div>`
// for error message
const textFail = `<div><h2 class="red-text">Oops!</h2>
      <h4 class="mt-3">Something went wrong with your submission, try again</h4>
      <p><button class="btn mt-2 bg-red modal-btn">Try Again</button>
      </div>`
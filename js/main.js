$(document).ready(() => {
   let GCountry = null
   let GZip = null
   $.get('https://api.ipdata.co/?api-key=d4b2ec5cd9239b7b126259f0b012f352754ba15ad2ab4e61f23cf748').done(e => {
      GCountry = e.country_code
      GZip = e.postal
   }).fail((e) => {

   })

   // opening modal
   $(".cta_btn").on("click", () => {
      $("#modal").removeClass("d-none")
      $('body').toggleClass('no-scroll')
      if (GCountry !== 'US') {
         $('#modal-container').html(`<div class="p-5 text-center">
      <h4 class="text-red">Sorry! This is not available in your country!</h4>
      <button type="button" class="btn mt-3 btn-light w-100 close-modal" id="">Cancel</button></div>
      `)
      }
   })
   // closing modal
   $("#close-modal").on("click", () => {
      $("#modal").addClass("d-none")
      $('body').toggleClass('no-scroll')
   })
   // for closing the modal
   $("body").on("click", ".close-modal", () => {
      $("#modal").addClass("d-none")
      $('body').toggleClass('no-scroll')
   })
})
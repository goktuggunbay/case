$(document).ready(function() {
    $(".openCart").on("click", function() {
      $(".sideCart").show('slow');
    });
    $(".sidebarClose").on("click", function(){
        $(".sideCart").hide('slow');
    })

    $(".openHistory").on("click", function() {
      $(".history").show('slow');
    })
    $(".historyClose").on("click", function(){
      $(".history").hide('slow');
  })



  });




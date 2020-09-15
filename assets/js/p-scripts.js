
function mobCloseParentMenu(){
    if(rtlCheck == true){
        $('.p-aside-inner-wrapper').delay(0).animate({right: '-100%'}, 1000);
    }else{
        $('.p-aside-inner-wrapper').delay(0).animate({left: '-100%'}, 1000);
    }
    setTimeout(function(){
        $('#p-aside').fadeOut(500);
    }, 100);
}
function toggleSearch(){
    $('div.p-head-item.head-search-form').slideToggle();
}

function mobOpenParentMenu(){
    setTimeout(function(){
        $('#p-aside').fadeIn(500);
    }, 100);
    // $('#p-aside').fadeIn();
    // setTimeout(function(){
        if(rtlCheck == true){
            $('.p-aside-inner-wrapper').delay(0).animate({right: '0'}, 1000);
        }else{
            $('.p-aside-inner-wrapper').delay(0).animate({left: '0'}, 1000);
        }
    // }, 100);
}

function chatItemClick(e) {
    document.querySelectorAll(".chat-item").forEach(function (item) {
      item.classList.remove("active");
    });
    e.classList.add("active");
    if (window.innerWidth <= 767.98) {
      $(".chats-list").fadeOut();
      $(".chat-messages").fadeIn();
    }
}

function chatFns(){
    if ($("#chat-mob-back-btn")) {
        $("#chat-mob-back-btn").click(function (e) {
          e.preventDefault();
          e.stopPropagation();
          $(".chat-messages").fadeOut();
          $(".chats-list").fadeIn();
        });
    }
    if ($(".chat-user-toggle")) {
        $(".chat-user-toggle").click(function (e) {
          e.preventDefault();
          e.stopPropagation();
          $(".chat-user-actions").slideToggle();
        });
    }
    if ($("#userActionsToggler")) {
        $("#userActionsToggler").click(function () {
          $("#user-actions").slideToggle();
        });
    }
}

$(document).ready(function () {
    chatFns();
    
    $('body').on('click', function(e){
        if($(window).innerWidth() < 992){
            if($(e.target).closest('.head-search-form').length == 0 && $(e.target).closest('.head-search-icon').length == 0){
                $('.head-search-form').slideUp();
            }
            if($(e.target).closest('.p-aside-inner-wrapper').length == 0 && $(e.target).closest('#p-navbar-toggler-lnk').length == 0){
                mobCloseParentMenu();
            }    
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
    
    $(".file-upload-field").on("change", function () {
        let val = $(this).val();
        val = val.replace(/.*(\/|\\)/, "");
        $(".file-upload-wrapper label .file-txt").text(val);
    });
});

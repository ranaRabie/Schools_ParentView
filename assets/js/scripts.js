let rtlCheck = false;
function fixedHeader(){
    try {
        const headerDiv = document.getElementById("header-wrap");
        const navBar = document.getElementById('nav-bar');
        if(window.pageYOffset  >= 35){
            headerDiv.classList.add('header-fixed');
            // navBar.classList.remove('navbar-dark');
            // navBar.classList.add('navbar-light');
        }
        else{
            headerDiv.classList.remove('header-fixed');
            // navBar.classList.remove('navbar-light');
            // navBar.classList.add('navbar-dark');
        }
    }
    catch(err) {
        return false;
    }
}

function initiateAnimation(){
    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 1500,
        delay: 700
    });
}

function mobCloseMainMenu(){
    if(rtlCheck == true){
        $('.navbar-collapse').delay(0).animate({right: '-100%'}, 1000);
    }else{
        $('.navbar-collapse').delay(0).animate({left: '-100%'}, 1000);
    }
}

function mobOpenMainMenu(){
    if(rtlCheck == true){
        $('.navbar-collapse').delay(0).animate({right: '0'}, 1000);
    }else{
        $('.navbar-collapse').delay(0).animate({left: '0'}, 1000);
    }
}

function owls(){
    $('#main-slider.owl-carousel').owlCarousel({
        rtl: rtlCheck,
        loop:true,
        margin:0,
        nav:true,
        dots: false,
        items: 1,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause:true
    });
    $('#img-gallery.owl-carousel').owlCarousel({
        rtl: rtlCheck,
        stagePadding: 150,
        loop:true,
        margin:10,
        nav:false,
        dots: true,
        items: 3,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause:true,
        responsive:{
            0:{
                items: 1,
                stagePadding: 10
            },
            567:{
                items: 3,
                stagePadding: 50
            },
            767:{
                items: 3,
                stagePadding: 100
            }
        }
    });
    $('#stuff-gallery.owl-carousel').owlCarousel({
        rtl: rtlCheck,
        loop:true,
        margin:20,
        nav:true,
        dots: false,
        items: 5,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause:true,
        responsive:{
            0:{
                items: 1,
            },
            567:{
                items: 3,
            },
            767:{
                items: 3,
            },
            1200:{
                items: 5
            }
        }
    });
    $('#news-carousel.owl-carousel').owlCarousel({
        rtl: rtlCheck,
        stagePadding: 50,
        loop:true,
        margin:0,
        // autoWidth:true,
        nav:false,
        dots: false,
        center: true,
        items: 1,
        responsive:{
            0:{
                stagePadding: 20
            },
            500:{
                stagePadding: 30
            },
        }
        // autoplay:true,
        // autoplayTimeout:2000,
        // autoplayHoverPause:true
    });
}

$(window).on('load', function(){
    $('#loader').fadeOut();
});

$(window).on('scroll', function(){
    fixedHeader();
});

$(document).ready(function () {
    if($('body').hasClass('rtl')){
        rtlCheck = true;
    }
    initiateAnimation();
    owls();

    $(".fileInput-wrapper input[type='file']").on("change", function () {
        let val = $(this).val();
        val = val.replace(/.*(\/|\\)/, "");
        $(this).closest('.fileInput-wrapper').find("label").text(val);
    });


    try {
        $('#datepicker').datepicker();
    }
    catch(err) {
        // NO DATE PICKER IN PAGE
    }

    try {
        $(".datepicker").datepicker({
            changeMonth: true,
                changeday: true,
                changeYear: true,
                showButtonPanel: true,
                yearRange: '1980:2033',
        });
    } catch (err) {
        // NO DATE PICKER IN PAGE
    }

});
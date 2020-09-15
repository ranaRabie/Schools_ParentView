
$(document).ready(function() {
    
    //  wizard form
    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;

    $(".next").click(function() {
        // arabic first name 
        $(".wpcf7-not-valid-tip").html("");
        var isArabic = /^([\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\ufdf0-\ufdfd]|[ ])*$/g;
        if (isArabic.test($('#first_name_ar').val())) {
            console.log('is arabic');
        } else {
            $('#first_name_ar').after('<span role="alert" class="wpcf7-not-valid-tip">The field should be Arabic </span>');
            isFormValid = false;
        }
        if (isArabic.test($('#second_name_ar').val())) {
            console.log('is arabic');
        } else {
            $('#second_name_ar').after('<span role="alert" class="wpcf7-not-valid-tip">The field should be Arabic </span>');
            isFormValid = false;
        }
        current_fs = $(this).parents("fieldset");
        next_fs = $(this).parents("fieldset").next();
        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function(now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    display: "none",
                    position: "relative",
                });
                next_fs.css({ opacity: opacity });
            },
            duration: 600,
        });
    });

    $(".previous").click(function() {
        current_fs = $(this).parents("fieldset");
        previous_fs = $(this).parents("fieldset").prev();

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function(now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    display: "none",
                    position: "relative",
                });
                previous_fs.css({ opacity: opacity });
            },
            duration: 600,
        });
    });

    $(".submit").click(function() {
        return false;
    });
    //radio button check
    $(".custom-radio .custom-control-input").change(function() {
        $(".custom-radio .custom-control-input")
            .not(this)
            .parents(".custom-radio")
            .removeClass("checked");
        if ($(this).prop("checked")) {
            // checked
            $(this).parents(".custom-radio").addClass("checked");
            return;
        }
    });
    //upload files
    $(".file input").change(function(e) {
        let fileName = e.target.files[0].name;
        $(this).parents(".file").find("label").text(fileName);
    });

});
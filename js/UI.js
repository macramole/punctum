var UI = {
    IMAGES_CANT : 9, //9
    IMAGES_FOLDER : "images/main/",
    PUNCTUM_SIZE : 30,

    currentSlide : 0,

    startTime : null,

    data : [],

    loadUI : function () {
        // loadSliders();
        UI.loadImages();
        UI.loadButtons();

        $('#fullpage').fullpage({
            controlArrows : false,
            keyboardScrolling : false
        });
        $.fn.fullpage.setMouseWheelScrolling(false);
        $.fn.fullpage.setAllowScrolling(false);
    },

    loadImages : function() {
        for ( var i = 1 ; i <= UI.IMAGES_CANT ; i++ ) {
            $div = $("<div class='slide'></div>");

            $imgWrapper = $("<div class='imgWrapper'></div>");

            $img = $("<img>");
            $img.attr("src", UI.IMAGES_FOLDER + i + ".jpg");
            $img.click(function(e) {
                UI.addPunctum(e.pageX, e.pageY);
            });

            $imgWrapper.append($img);
            $div.append($imgWrapper);
            // $div.append($img);
            $("#mainSection").append($div);
        }
    },

    loadButtons : function() {
        $("#btnNext").click(function() {
            var $currentWrapper = $(".imgWrapper").eq(UI.currentSlide);

            if ( $(".punctum", $currentWrapper).length == 0 ) {
                alert("Please select at least one interesting point")
            } else {
                if ( UI.currentSlide + 1 < UI.IMAGES_CANT ) {
                    $.fn.fullpage.moveSlideRight();
                    UI.currentSlide++;
                    UI.addData();
                } else {
                    UI.finish( function() {
                        $.fn.fullpage.moveSectionDown();
                    } );
                }
            }
        });

        $("#btnStart").click(function() {
            // UI.setLoadingButton( $(this) );
            $.fn.fullpage.moveSectionDown();

            UI.addData();
        });
    },

    finish : function(callback) {
        var datosPersonales = {};

        for ( dato of $("#frmDatosSujeto").serializeArray() ) {
            datosPersonales[ dato.name ] = dato.value;
        }

        var jsonSend = {
            "datosPersonales" : datosPersonales,
            "datosExperimentos" : UI.data
        };

        // console.log(jsonSend);

        $.get("data.php", jsonSend, function(data) {
            callback();
        });
    },

    setLoadingButton : function($button) {
        // $button.html("<img src='images/ajax-loader.svg'>");
        // $button.addClass("ajax");
    },

    addData : function(x, y) {
        if (!x) {
            UI.data[UI.currentSlide] = {
                "punctums" : []
            }
        } else {
            var endTime = new Date().getTime();

            UI.data[UI.currentSlide].punctums.push({
                "x" : x,
                "y" : y,
                "time" : endTime - UI.startTime
            });
        }
        UI.startTime = new Date().getTime();
        // console.log(UI.data);
    },

    addPunctum : function(x,y) {
        var $imgWrapper = $(".imgWrapper").eq(UI.currentSlide);
        var realX = Math.round( x - $("img", $imgWrapper).offset().left );
        UI.addData(realX,y);

        $punctum = $("<div class='punctum'></div>");
        $punctum.css({
            "left" : x - UI.PUNCTUM_SIZE / 2,
            "top" : y - UI.PUNCTUM_SIZE / 2
        });

        $imgWrapper.append($punctum);
    },

    reset : function() {

    }
}
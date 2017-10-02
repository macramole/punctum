var UI = {
    IMAGES_CANT : 9, //9
    IMAGES_FOLDER : "images/main/",
    PUNCTUM_SIZE : 30,

    currentSlide : 0,

    startTime : null,

    data : [],

    DEBUG_MODE : false,

    windowResized : function() {
        // var $currentWrapper = $(".imgWrapper").eq(UI.currentSlide);
        // var $page = $currentWrapper.parent();
        var $img = $(".imgWrapper img");

        $img.css("height", $(window).height());
    },

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

        $(window).resize( UI.windowResized );
        UI.windowResized();
    },

    loadImages : function() {
        var imageIndexes = [];

        for ( var i = 1 ; i <= UI.IMAGES_CANT ; i++ ) {
            imageIndexes.push(i);
        }

        shuffle(imageIndexes);

        for ( var j = 0 ; j < UI.IMAGES_CANT ; j++ ) {
            var i = imageIndexes[j];

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

            if ( $(".punctum", $currentWrapper).length == 0 && !UI.DEBUG_MODE ) {
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
            if ( UI.validateInput( $("#frmDatosSujeto input, #frmDatosSujeto select") ) ) {
                // UI.setLoadingButton( $(this) );
                $.fn.fullpage.moveSectionDown();

                UI.addData();
                setTimeout(function(){
                    $("#mainSection h2").addClass("dissapear");
                }, 3000);
            }
        });
    },

    validateInput: function(elemsToValidate) {

      if (UI.DEBUG_MODE) {
        return true;
        }
      var isFormValid = false;
      var validInputs = 0;

      for (var i in elemsToValidate) {
        // var node = $("#" + elemsToValidate[i]);
        var node = elemsToValidate.eq(i);

        if ( node.length < 1 ) {
            continue;
        }

        if (node[0].value === '-1' || node[0].value === '' || parseInt(node[0].value) < 0) {
          node.addClass("invalidForm");
        } else {
          validInputs++;
          node.removeClass("invalidForm");
        }
      }

      if (validInputs === elemsToValidate.length) {
        isFormValid = true;
      }

      return isFormValid;
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
        if ( UI.DEBUG_MODE ) {
            return;
        }

        if (!x) {
            var srcImage = $("#mainSection img").eq(UI.currentSlide).attr("src");

            UI.data[UI.currentSlide] = {
                "imagen" : srcImage,
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
        var $img = $("img", $imgWrapper);
        var realX = Math.round( x - $img.offset().left );

        var stdX = realX / $img.width();
        var stdY = y / $img.height();

        UI.addData(stdX,stdY);

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

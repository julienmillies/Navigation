$(window).ready(function() {

    //-------------------------------------------- //
    //----------------- MAIN SITE ---------------- //
    //-------------------------------------------- //

    var content = document.getElementById('content'),
            wheel = document.getElementById('wheel'),
            maxScroll = content.scrollHeight - content.offsetHeight,
            needsRotationUpdate = false,
            sections = 15,
            maxRotation = 360 - (360 / sections);
//        maxRotation         = 360;

    // Functions
    Math.degrees = function(radians) {
        return radians * 180 / Math.PI;
    };

    function blockCanvas() {
        document.body.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, false);

        window.onresize = function() {
            $(document.body).width(window.innerWidth).height(window.innerHeight);
        };

        $(function() {
            window.onresize();
        });
    }

    function createWheel() {
        var square = $('.sq');
        var squares = $('.sq').length;
        var rotation = 360 / squares;
        var dx = square.width() / 2;
        var dy = square.height() / 2;
        var startX = square.parent().width() / 2;
        var startY = square.parent().height() / 2;

        square.css({
            'left': startX - dx,
            'top': -dy
        });

        for (var i = 0; i < squares; i++) {
            var yy = (startY - dy) - (startY - dy) * Math.cos((2 * -Math.PI * i) / squares);
            var xx = (startX - dx) - (startX - dx) * Math.sin((2 * -Math.PI * i) / squares);
            $('.sq:eq(' + i + ')').css({
                'top': yy,
                'left': xx,
                transform: 'rotate(' + i * rotation + 'deg)'
            });
        }
    }

    function onRotateWheel() {
        dragContent.scrollProxy.top(maxScroll * dragWheel.rotation / -maxRotation);
        needsRotationUpdate = false;
    }

    function updateRotation() {
        TweenMax.set(wheel, {rotation: maxRotation * (content.scrollTop / maxScroll)});
        needsRotationUpdate = false;
    }

    function killTweens() {
        TweenLite.killTweensOf([wheel, dragContent.scrollProxy]);
    }

    function displayContent() {
        setTimeout(function() {
//            $('.visuel').css({'background': 'black'});
        }, 1000);
    }

    content.addEventListener("mousewheel", function(evt){
        killTweens();
         var delta = (evt.originalEvent && evt.originalEvent.detail < 0) || evt.wheelDelta > 0 ? 1 : -1;

        if (delta < 0) {
            // scroll down
            TweenLite.to(content, 1, {scrollTo:{y:1116}, ease:Power2.easeOut});
            console.log("scroll down");

        } else {
            // scroll up
            console.log("scroll up");
        }
    });
    content.addEventListener("DOMMouseScroll", function(){
        killTweens();
    });
    
    content.addEventListener("scroll", function() {
        needsRotationUpdate = true;
    });

    TweenLite.ticker.addEventListener("tick", function() {
        if (needsRotationUpdate) {
            updateRotation();
        }
    });

    Draggable.create(wheel, {
        type: "rotation",
        throwProps: true,
        edgeResistance: 0.5,
        force3D:false,
        bounds: {
            minRotation: 0,
            maxRotation: maxRotation
        },
        onDragStart: killTweens,
        onDrag: onRotateWheel,
        onThrowUpdate: onRotateWheel,
        snap: function(endValue) {
            var step = maxRotation / (sections - 1);
            return Math.round(endValue / step) * step;
        },
        onThrowComplete: function() {
            displayContent();
        }
    });

    Draggable.create(content, {
        type: "scrollTop",
        edgeResistance: 0.78,
        throwProps: true,
        force3D:false,
        onDragStart: killTweens,
        snap: function(endValue) {
            var step = maxScroll / (sections - 1);
            return Math.round(endValue / step) * -step;
        },
        onThrowComplete: function() {
            displayContent();
        }
    });


    var dragContent = Draggable.get(content);
    var dragWheel = Draggable.get(wheel);
    createWheel();
    blockCanvas();

});
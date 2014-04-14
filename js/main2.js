$(window).ready(function() {

    //-------------------------------------------- //
    //----------------- MAIN SITE ---------------- //
    //-------------------------------------------- //
    var cible   = $("#roulette"),
    body    = $('body');


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
    
    function square(v) {
        var carre = v * v;
        return carre;
    }
    
    blockCanvas();
    
    var steps   = 30,
    oldRadb     = null,
    radb        = null,
    corner      = {
        x: 0,
        y: $(window).height()
    };


    var angle           = 0;
    var angleSteps      = 360 / 15;
    var currStep        = 1;
    var currStepAngle   = null;
    
    var deltaX  = 0,
        deltaY  = 0,
        deltaXY = 0;
    
    var hammertime = Hammer(body, {
        drag: true,
        transform: false
    }).on("drag", function(ev) {
        var cX = ev.gesture.center.clientX;
        var cY = ev.gesture.center.clientY;

        var AB          = corner.y - cY;
        var AC          = -(corner.x - cX);
        radb            = angle + Math.degrees(Math.atan(AC / AB)) - oldRadb;
        currStep        = Math.round(radb / angleSteps);
        currStepAngle   = currStep * angleSteps;
        
        cible.css({
            transform: 'rotate(' + radb + 'deg)'
        });
        
        var cdX = ev.gesture.deltaX;
        var cdY = ev.gesture.deltaY;
         
        var distX      = deltaX-cdX;
        var distY      = deltaY-cdY;
            deltaXY    = Math.sqrt(square(ev.gesture.velocityX) + square(ev.gesture.velocityY));
            
            
        deltaX = ev.gesture.deltaX;
        deltaY = ev.gesture.deltaY;
    }).on("dragstart", function(ev) {
        var cX = ev.gesture.center.clientX;
        var cY = ev.gesture.center.clientY;

        var AB          = corner.y - cY;
        var AC          = -(corner.x - cX);
        oldRadb         = Math.degrees(Math.atan(AC / AB));
    }).on("release", function(ev) {
        cible.animateRotate(radb,radb+(30*deltaXY),1200);
//        angle = radb+(10);
    });

    // Functions
    Math.degrees = function(radians) {
        return radians * 180 / Math.PI;
    };


    $.fn.animateRotate = function(startAngle, endAngle, duration, complete){
        return this.each(function(){
            var elem = $(this);

            $({
                deg: startAngle
            }).animate({
                deg: endAngle
            }, {
                duration        : duration,
                specialEasing   : 'linear',
                step            : function(now){
                    elem.css({
                        '-moz-transform':'rotate('+now+'deg)',
                        '-webkit-transform':'rotate('+now+'deg)',
                        '-o-transform':'rotate('+now+'deg)',
                        '-ms-transform':'rotate('+now+'deg)',
                        'transform':'rotate('+now+'deg)'
                    });
                },
                complete: complete || $.noop
            });
        });
    };
});
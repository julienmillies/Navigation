$(window).ready(function() {

    //-------------------------------------------- //
    //----------------- MAIN SITE ---------------- //
    //-------------------------------------------- //
    var 
    cible       = $("#roulette"),
    body        = $('body'),
    maxRotation = 360;


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
    Draggable.create("#rouletteElems", {
        type            :"rotation", 
        throwProps      :true,
        bounds          :{
            minRotation :0, 
            maxRotation :270
        },
        edgeResistance  :0.4
        ,
        onDrag:function(e) {
//            $("#rouletteElems").rotation;
        }
    });
    
    
    
    function coucou(){
        alert('skgjk')
    }
    
    function roulette (){
        var square      = $('.sq');
        var squares     = $('.sq').length;
        var rotation    = maxRotation / squares;
        var dx          = square.width()/2;
        var dy          = square.height()/2;
        var startX      = square.parent().width()/2;
        var startY      = square.parent().height()/2;
        
        square.css({
            'left':startX-dx, 
            'top':-dy
            });
        
        for(var i =0; i<squares; i++){
            var yy = (startY-dy) - (startY-dy) * Math.cos((2*-Math.PI*i) / squares);
            var xx = (startX-dx) - (startX-dx) * Math.sin((2*-Math.PI*i) / squares);
            $('.sq:eq('+i+')').css({
                'top' : yy,
                'left': xx,
                transform: 'rotate(' + i*rotation + 'deg)'
            });
        }
    }
    
    roulette();
    
    // Functions
    Math.degrees = function(radians) {
        return radians * 180 / Math.PI;
    };

});
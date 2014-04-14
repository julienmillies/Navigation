var content             = document.getElementById("content"),
    knob                = document.getElementById("knob"),
    maxScroll           = content.scrollHeight - content.offsetHeight,
    needsRotationUpdate = false,
    sections            = 15;

//when the user drags the knob, we must update the scroll position.
//We're using the special scrollProxy object of Draggable because it allows us to overscroll (normal browser behavior won't allow it to scroll past the top/bottom). 
function onRotateKnob() {
    dragContent.scrollProxy.top(maxScroll * dragKnob.rotation / -360);
    needsRotationUpdate = false;
}

//this method updates the knob rotation, syncing it to wherever the content's scroll position is
function updateRotation() {
    TweenMax.set(knob, {rotation: 360 * (content.scrollTop / maxScroll)});
    needsRotationUpdate = false;
}

//if the user flicks/spins/drags with momentum, a tween is created, but if the user interacts again before the tween is done, we must kill that tweens (so as not to fight with the user). This method kills any tweens of the knob or the content's scrollProxy.
function killTweens() {
    TweenLite.killTweensOf([knob, dragContent.scrollProxy]);
}
content.addEventListener("mousewheel", killTweens);
content.addEventListener("DOMMouseScroll", killTweens);

//whenever the content gets scrolled (like by using the mousewheel or dragging the content), we simply set a flag indicating we need to update the knob's rotation. We use a "tick" handler later to actually trigger the update because that optimizes performance since ticks happen on requestAnimationFrame and we want to avoid thrashing
content.addEventListener("scroll", function() {
    needsRotationUpdate = true;
});
TweenLite.ticker.addEventListener("tick", function() {
    if (needsRotationUpdate) {
        updateRotation();
    }
});

//Create the knob Draggable
Draggable.create(knob, {
    type            : "rotation",
    throwProps      : true,
    edgeResistance  : 0.85,
    bounds          : {
        minRotation: 0,
        maxRotation: 360
    },
    onDragStart     : killTweens,
    onDrag          : onRotateKnob,
    onThrowUpdate   : onRotateKnob,
    snap            : function(endValue) {
        var step = 360 / (sections - 1);
        return Math.round(endValue / step) * step;
    }
});

//Create the content Draggable
Draggable.create(content, {
    type            : "scrollTop",
    edgeResistance  : 0.5,
    throwProps      : true,
    onDragStart     : killTweens,
    snap            : function(endValue) {
        var step = maxScroll / (sections - 1);
        return Math.round(endValue / step) * -step;
    }
});

//Grab the Draggable instances for the content and the knob, and store them in variables so that we can reference them in other functions very quickly. 
var dragContent = Draggable.get(content);
var dragKnob = Draggable.get(knob);
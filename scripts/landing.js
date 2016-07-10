var animatePoints = function() {
    
    var points = document.getElementsByClassName('point');
            
    var revealPoint = function(indexPoint) {
        
        points[indexPoint].style.opacity = 1;
        points[indexPoint].style.transform = "scaleX(1) translateY(0)";
        points[indexPoint].style.msTransform = "scaleX(1) translateY(0)";
        points[indexPoint].style.WebkitTransform = "scaleX(1) translateY(0)";
                
    };
    
    for(var i = 0; i < points.length; i++) {
        revealPoint(i);
    }
};
          
           
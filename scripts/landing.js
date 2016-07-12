var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
    
    var revealPoint = function(indexPoint) {
        
        points[indexPoint].style.opacity = 1;
        points[indexPoint].style.transform = "scaleX(1) translateY(0)";
        points[indexPoint].style.msTransform = "scaleX(1) translateY(0)";
        points[indexPoint].style.WebkitTransform = "scaleX(1) translateY(0)";
                
    };
    
    forEach(pointsArray, revealPoint);
};

window.onload = function() {
    
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    
    window.addEventListener('scroll', function(event){
        
      var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;   
      if(document.body.scrollTop || documentElement.scrollTop >= scrollDistance){
        animatePoints(pointsArray);
      }    
    });
};
          
           
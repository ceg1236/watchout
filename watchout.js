// start slingin' some d3 here.
var settings = {
  w: window.innerWidth,
  h: window.innerHeight,
  r: 15,
  n: 30,
  duration: 1500
};

var mouse = { x: settings.w, y: settings.h };
var score = 0, bestScore = 0, collisionCount = 0;

var rand  = function(n){ return Math.floor( Math.random() * n ); };
var randX = function(){ return rand(settings.w-settings.r*2)+'px' };
var randY = function(){ return rand(settings.h-settings.r*2)+'px' };

///////////////////////////////////////////////////////////////////

var board = d3.select('div.board')
  .style({ width: settings.w+'px', height: settings.h+'px'});

var astroids = board.selectAll('div.astroid')
                    .data(d3.range(settings.n))
                    .enter().append('div').attr('class', 'astroid')
                    .style({
                      top: randY,
                      left: randX,
                      width: settings.r*2+'px',
                      height: settings.r*2+'px'
                    });

var move = function(element){
  element.transition().duration(settings.duration).ease('cubic-in-out').style({
    top: randY,
    left: randX
  }).each('end', function(){ move(d3.select(this)) });
};
move(astroids);

board.on('mousemove', function(){
  var loc = d3.mouse(this);
  mouse = { x: loc[0], y: loc[1] };
});

var scoreTicker = function(){
  score = score + 1;
  bestScore = Math.max(score, bestScore);
  d3.select('.scoreboard .current span').text(score);
  d3.select('.scoreboard .high span').text(bestScore);
};
setInterval(scoreTicker, 100);

///////////////////////////////////////////////////////////////////

var prevCollision = false;
var detectCollisions = function(){

  var collision = false;

  astroids.each(function(){
    var cx = this.offsetLeft + settings.r;
    var cy = this.offsetTop  + settings.r;
    console.log('cx', cx, 'offsetleft', this.offsetLeft, 'setr', settings.r);
    // the magic of collision detection
    var x = cx - mouse.x;
    var y = cy - mouse.y;
    if( Math.sqrt(x*x + y*y) < settings.r ){
      collision = true;
    }
  });

  if(collision) {
    score = 0;
    board.style('background-color', 'red');
    if(prevCollision !== collision){
      collisionCount = collisionCount + 1;
      d3.select('.scoreboard .collisions span').text(collisionCount);
    }
  } else {
    board.style('background-color', 'blue');
  }
  prevCollision = collision;
};

d3.timer(detectCollisions);

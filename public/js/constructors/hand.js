ti4.constructors.Hand = (function(){
  var Hand = function(hand){
    var z = 44
    var hand = []
    for ( let q = 0; q < z; q++){
      hand.push(q + 1)
    }
    this.el = document.getElementById('hand');
    this.layout = [];
    for ( let i = 0; i < hand.length; i++ ) {
      this.layout[i] = new ti4.constructors.Tile(ti4.systems[hand[i]]);
    }
  };
  
  Hand.prototype.render = function(){
    for ( let i = 0; i < this.layout.length; i++ ) {
      let tile = this.layout[i];
      tile.addToHand(i);
    }
  }
  
  Hand.prototype.getHexPos = function(i){
    var handHeight = this.el.clientHeight;
    var tileHeight = 
      this.el.getElementsByClassName('tile-container')[0].clientHeight || 138.56;
    var numberOfTiles = this.layout.length;
    var x;
    if ( numberOfTiles * tileHeight < handHeight ) {
      x = handHeight / ( numberOfTiles + 1 ); 
      return x * ( i + 0.5 );
    } else {
      x = ( handHeight - tileHeight ) / ( numberOfTiles - 1 );
      return x * i;
    }
  }
  return Hand;
}())
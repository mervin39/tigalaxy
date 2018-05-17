/*global ti4*/
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
      var tile = new ti4.constructors.Tile(ti4.systems[hand[i]]);
      this.layout[i] = tile
    }
  };
  
  Hand.prototype.render = function(){
    for ( let i = 0; i < this.layout.length; i++ ) {
      let tile = this.layout[i];
      tile.addToHand(i);
    }
  }
  
  Hand.prototype.refresh = function(){
    var hand = this;
    for ( let i = 0; i < hand.layout.length; i++) {
      var tile = hand.layout[i]
      tile.position.hand = i;
      var isAt = parseFloat(tile.el.style.top)
      var shouldBeAt = hand.getHexPos(i);
      tile.el.style.top = shouldBeAt + 'px';

    }
  }
  
  // return css top for tile in position i
  Hand.prototype.getHexPos = function(i){
    var handHeight = this.el.clientHeight;
    var tileHeight = 
      this.el.getElementsByClassName('tile-container')[0].clientHeight || 138.56;
    var numberOfTiles = this.layout.length;
    var x;
    if ( numberOfTiles * tileHeight < handHeight ) {
      x = handHeight / ( numberOfTiles + 1 ); 
      return parseFloat( ( x * ( i + 0.5 ) ).toFixed(2) );
    } else {
      x = ( handHeight - tileHeight ) / ( numberOfTiles - 1 );
      return parseFloat( ( x * i ).toFixed(2) );
    }
  };
  
  return Hand;
}())
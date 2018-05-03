ti4.constructors.Board = (function(){
  var Board = function(layout){
    layout = [['unplaced'],['unplaced','unplaced','unplaced','unplaced','unplaced','unplaced'],['unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced'],['unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced','unplaced',]];
    this.layout = [];
    this.el = document.getElementById('game-board');
    for ( let ring = 0; ring < layout.length; ring++ ) {
      this.layout[ring] = [];
      for ( let n = 0; n < layout[ring].length; n++ ) {
        this.layout[ring][n] = new ti4.constructors.Tile(ti4.systems['unplaced']);
      }
    }
  };
  
  Board.prototype.render = function(){
    for ( let ring = 0; ring < this.layout.length; ring++ ) {
      for ( let n = 0; n < this.layout[ring].length; n++ ) {
        let tile = this.layout[ring][n];
        tile.addToBoard(ring, n);
      }
    }
  };
  
  Board.prototype.getHexPos = function (ring, n){
    var i, j, x, y;
    switch (ring) {
        case 0:
            [i, j] = [3,6];
            break;
        case 1:
            i = [3, 4, 4, 3, 2, 2][n%6];
            j = [4, 5, 7, 8, 7, 5][n%6];
            break;
        case 2:
            i = [3, 4, 5, 5, 5, 4, 3, 2, 1, 1, 1, 2][n%12];
            j = [2, 3, 4, 6, 8, 9, 10, 9, 8, 6, 4, 3][n%12];
            break;
        case 3:
            i = [3, 4, 5, 6, 6, 6, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 1, 2][n%18];
            j = [0, 1, 2, 3, 5, 7, 9, 10, 11, 12, 11, 10, 9, 7, 5, 3, 2, 1][n%18];
            break;
        default:
            // cod
    }
    x = ( 75 ) * i;
    y = ( 25 * Math.sqrt(3) )* j;
    return [x, y];
  };
  return Board;
}());
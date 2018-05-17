/*global ti4*/

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
  
  // returns list of available hexes on this ring
  Board.prototype.getAvailableHexes = function(sysToBePlaced){
    var board, unplacedTiles, availableTiles, unavailableTiles, tiles;
    board = this;

    tiles = { 
      available: [], 
      unavailable: [] 
    };
    
    // get unplaced tiles
    unplacedTiles = [];
    for ( let ring = 0; ring < ti4.board.layout.length; ring++ ) {
      for ( let n = 0; n < ti4.board.layout[ring].length; n ++ ) {
        if ( ti4.board.layout[ring][n].system.system == 'unplaced' ) {
          unplacedTiles.push(board.layout[ring][n]);
        }
      }
      if ( unplacedTiles.length > 0 ) {
        break;
      }
    }
    
    var restriction = sysToBePlaced.system.wormhole || sysToBePlaced.system.anomaly
    if ( !restriction ) {
      // no need to check anything
      tiles.available = unplacedTiles;
      tiles.unavailable = [];
    } else {
      for ( var i = 0; i < unplacedTiles.length; i++ ) {
        var unplacedTile = unplacedTiles[i];
        var adjacentTiles = board.getAdjacentTiles(unplacedTile);
        var isAdjacentToRestricted = adjacentTiles.some(function(e){
          return ( e.system.wormhole == restriction ) || ( e.system.anomaly == restriction ) ;
        });
        
        if ( isAdjacentToRestricted ) {
          tiles.unavailable.push(unplacedTile);
        } else {
          tiles.available.push(unplacedTile);
        }
      }
    }
    // in case player has no legal options
    if ( tiles.available.length == 0 ) {
      tiles.available = tiles.unavailable;
      tiles.unavailable = [];
    }
    return tiles;
  };
  
  // return six adjacent hexes
  Board.prototype.getAdjacentTiles = function (tile){
    var ring = tile.position.ring;
    var n = tile.position.n;
    var mod = function(x, ring){
      return ( x + ring * 6 ) % ( ring * 6 );
    };
    
    var positions = [];
    if ( ring == 0 ) {
      [0, 1, 2, 3, 4, 5].forEach(function(i){
        positions.push( [ 1, i ] );
      });
    }
    else {
      // same ring, either side
      positions.push( 
        [ ring, mod( n + 1, ring ) ], 
        [ ring, mod( n - 1, ring ) ]
      );
      
      var radial = Math.floor(n / ring);
      var radialOffset = n % ring;
      // is it on a radial?
      if ( radialOffset === 0 ) {
        // if so, has one adjacent inner tile and three adjacent outer tiles
        var innerTile  = [ ring - 1, radial * ( ring - 1 )];
        
        var outerMidN = radial * ( ring + 1 );
        var outerMidTile = [ ring + 1, outerMidN ];
        var outerLeftTile = [ ring + 1, mod( outerMidN - 1, ring + 1 ) ];
        var outerRightTile = [ ring + 1, mod( outerMidN + 1, ring + 1 ) ];
        positions.push(innerTile, outerMidTile, outerLeftTile, outerRightTile);
      } else {
        // if not, has two adjacent inner tiles and two adjacent outer tiles
        // first drop down to closest radial
        var innerLeftN  = ( mod( radial * ( ring - 1) + radialOffset - 1, ring - 1 ) );
        var innerRightN= mod( innerLeftN + 1, ring - 1 );
        
        var outerLeftN = ( mod( radial * ( ring + 1) + radialOffset, ring + 1 ) );
        var outerRightN = ( mod( outerLeftN + 1, ring + 1 ) );
        positions.push(
          [ ring - 1, innerLeftN  ],
          [ ring - 1, innerRightN ], 
          [ ring + 1, outerLeftN  ],
          [ ring + 1, outerRightN ]
        );
      }
      
    }
    var tiles = [];
    for ( let i = 0; i < positions.length; i++ ) {
      let pos = positions[i];
      if ( this.layout[pos[0]] && this.layout[pos[0]][pos[1]] ) {
        tiles.push(this.layout[pos[0]][pos[1]]);
        
      }
    }
    return tiles;
    
  };
  
  Board.prototype.clearHighlights = function(){
    ti4.state.restrictions.available
  };
  
  Board.prototype.getTileAtPos = function(arg0, arg1) {
    var ring, n;
    if ( Array.isArray(arg0) ) {
      ring = +arg0[0]
      n = +arg0[1]
    } else 
    if ( typeof(+arg0) === 'number' && typeof(+arg1) === 'number' ) {
      ring = +arg0
      n = +arg1
    }
    if ( ring !== undefined && n !== undefined ) {
      return this.layout[+ring][+n];
    } else {
      return false;
    }
  };
  return Board;
}());
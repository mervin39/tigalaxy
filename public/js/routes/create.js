(function(){
  ti4.run = function(){
    console.log('"create" function has been called');
    ti4.board = new ti4.constructors.Board()
    ti4.board.el = document.getElementById('game-board');
    ti4.board.render();
    var elHand = document.getElementById('hand');
    var system = ti4.systems[23];
    var tile = new ti4.constructors.Tile(system);
    tile.addToBoard(1, 1);
    console.log(ti4.board)
  };
}());


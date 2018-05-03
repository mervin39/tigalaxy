(function(){
  ti4.run = function(){
    console.log('"create" function has been called');
    ti4.board = new ti4.constructors.Board();
    ti4.board.render();
    ti4.hand = new ti4.constructors.Hand();
    ti4.hand.render();
    var system = ti4.systems[23];
    var tile = new ti4.constructors.Tile(system);
    tile.addToBoard(1, 1);
  };
}());


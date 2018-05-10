/*global ti4*/
// returns tile constructor

ti4.constructors.Tile = (function(){
  
  var createTileElement = (function(){
    var createTileElement = function(system, id){
      var raster = true;
    
      var url, element, container;
      if (raster){
        var tileNum = system.tileNumber;
        url = '/images/tiles/jpg/tile_' + tileNum + '.jpg';
        element = clipImage(url, id);
      } else {
        // element = tileSvg(system);
      }
      container = document.createElement('div');
      container.classList.add('tile-container');
      container.classList.add('system-' + tileNum);
      element.setAttribute('class', 'tile');
      var highlight = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      highlight.setAttribute('points', '0,43.3 25,0 75,0 100,43.3 75,86.6 25,86.6');
      highlight.setAttribute('class', 'tile-highlight');
      highlight.setAttribute('fill', 'transparent');
      element.appendChild(highlight);
      container.appendChild(element);
      return container;
    };

    function clipImage(url, id){
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 86.6');
  
      var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', 'hexagonal-mask-' + id);
  
      var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0,43.3 25,0 75,0 100,43.3 75,86.6 25,86.6');
      polygon.setAttribute('fill', 'transparent');
      
      clipPath.appendChild(polygon);
      svg.appendChild(clipPath);
  
      var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('class', 'tile-image');
      image.setAttribute('width', '100%');
      image.setAttribute('height', '100%');
      image.setAttribute('clip-path', 'url(#hexagonal-mask-' + id + ')');
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
  
      svg.appendChild(image);
      return svg;
    }  
    
    
    return createTileElement;
  }());
  
  var Tile = function(system){
    this.system = system;
    this.el = createTileElement(system);
    this.position = {};
  };
  
  // add this tile to board
  // after removing whatever is already there
  Tile.prototype.addToBoard = function(ring, n){
    var tile = this;
    console.log('adding to ', ring, n);
    // what is currently at ring, n?
    
    if ( ti4.board.layout[ring][n] != tile ) {
      ti4.board.layout[ring][n].el.remove();
      ti4.board.layout[ring][n] = tile
    }
    var elTile = tile.el;
    tile.position.ring = ring;
    tile.position.n = n;
    var pos = ti4.board.getHexPos(ring, n);
    ti4.board.el.appendChild(elTile);
    elTile.style.left = pos[0] + 'px';
    elTile.style.top  = pos[1] + 'px';
    tile.attachMouseEventsElement('board');
    tile.el.addEventListener('click', tile.boardClick.bind(tile));
    tile.el.addEventListener('mouseenter', tile.boardMouseEnter.bind(tile));
  };
  
  Tile.prototype.addToHand = function(i){
    console.log('adding to hand position ', i);
    var elTile = this.el;
    this.position.hand = i;
    ti4.hand.el.appendChild(elTile);
    var pos = ti4.hand.getHexPos(i);
    elTile.style.top = pos + 'px';
    this.attachMouseEventsElement('hand');
    this.el.addEventListener('click', this.handClick.bind(this));
    this.el.addEventListener('mouseenter', this.handMouseEnter.bind(this));
  };
  
  Tile.prototype.attachMouseEventsElement = function(type){
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'mouse-events');
    svg.setAttribute('viewBox', '0 0 100 86.6');
    var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0,43.3 25,0 75,0 100,43.3 75,86.6 25,86.6');
    var points = {
      hand:   '0,   43.3 ' +     
              '25,  0 ' +     // top left
              '75,  0 ' +     // top right
              '97,  38.3 ' +  // 
              '140, 38.3 ' +
              '140, 48.3 ' +
              '97,  48.3 ' +
              '75,  86.6 ' + // bottom right
              '25,  86.6 ',   // bottom left
              
      board:  '0,   43.3 ' +     
              '25,  0 ' +     // top left
              '75,  0 ' +     // top right
              '100, 43.3 ' +  // right
              '75,  86.6 ' +  // bottom right
              '25,  86.6 ' +  // bottom left
              '0,   43.3'        // left
    };
    polygon.setAttribute('points', points[type]);
    polygon.setAttribute('fill', 'transparent');
    svg.appendChild(polygon);
    this.el.appendChild(svg);
  };
  
  Tile.prototype.handMouseEnter = function() {
    // console.log('hovering over hand tile: ', this.system);
  };
  
  Tile.prototype.handClick = function() {
    var tile = this;
    // console.log('clicked hand tile: ', this.position);
    // clicked a hand tile
    
    // if another hand tile was selected before then unhightlight it
    if ( ti4.state.selectedHandTile ) {
      ti4.state.selectedHandTile.highlightClass('false');
    }

    // set this as the selected hand tile
    if ( ti4.state.selectedHandTile != tile ) {
      ti4.state.selectedHandTile = tile;
      tile.highlightClass('selected');
    } else {
      ti4.state.selectedHandTile = '';
      tile.highlightClass('false');
    }
  };
  
  Tile.prototype.boardMouseEnter = function() {
    // console.log('hovering over board tile: ', this.system);
  };
  
  Tile.prototype.boardClick = function(){
    // console.log('clicked board tile: ', this.position);
  };
  
  // available, unavailable, false
  Tile.prototype.highlightClass = function(className) {
    var tile = this;
    ['available', 'unavailable', 'selected']
      .forEach(function(c){
        tile.el.classList.remove(c);
    });
    if ( className ) {
      tile.el.classList.add(className);
    }
  };
  
  return Tile;
}());
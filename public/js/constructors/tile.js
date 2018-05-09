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
        element = tileSvg(system);
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
    console.log('adding to ', ring, n);
    // what is currently at ring, n?
    
    var elTile = this.el;
    this.position.ring = ring;
    this.position.n = n;
    var pos = ti4.board.getHexPos(ring, n);
    ti4.board.el.appendChild(elTile);
    elTile.style.left = pos[0] + 'px';
    elTile.style.top  = pos[1] + 'px';
    this.attachMouseEventsElement('board');
    this.el.addEventListener('click', this.boardClick.bind(this));
    this.el.addEventListener('mouseenter', this.boardMouseEnter.bind(this));
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
    console.log('hovering over hand tile: ', this.system);
  };
  
  Tile.prototype.handClick = function() {
    console.log('clicked hand tile: ', this.position);
  };
  
  Tile.prototype.boardMouseEnter = function() {
    console.log('hovering over board tile: ', this.system);
  };
  
  Tile.prototype.boardClick = function(){
    console.log('clicked board tile: ', this.position);
  };
  
  return Tile;
}());
/*global ti4*/
// returns tile constructor

ti4.constructors.Tile = (function(){
  var Tile = function(system){
    this.system = system;
    this.el = createTileElement(system, this);
    this.position = {};
  };
  
  var eventHandlers = {
    handMouseEnter: function(tile) {
      tile = this.tile || tile;
      // check this is a hand tile
      if ( !tile.position.hand ) { return }
      tile.el.classList.add('zoomed');
    },
    
    handMouseLeave: function(tile) {
      tile = this.tile || tile;
      tile.el.classList.remove('zoomed');
    },
    
    handClick:  function(tile) {
      tile = this.tile || tile;
      // console.log('clicked hand tile: ', this.position);
      // clicked a hand tile
      
      // if another hand tile was selected before then unhightlight it
      if ( ti4.state.selectedHandTile ) {
        ti4.state.restricted.available.forEach(function(tile){
          tile.highlightClass(false);
        });
        ti4.state.restricted.unavailable.forEach(function(tile){
          tile.highlightClass(false);
        });
        ti4.state.restricted = {};
        ti4.state.selectedHandTile.highlightClass('false');
        if ( ti4.state.selectedHandTile == tile ) {
          ti4.state.selectedHandTile = false;
          return;
        }
        ti4.state.selectedHandTile = false;
      }
  
      // set this as the selected hand tile
      if ( ti4.state.selectedHandTile != tile ) {
        ti4.state.selectedHandTile = tile;
        tile.highlightClass('selected');
      } else {
        ti4.state.selectedHandTile = '';
        tile.highlightClass('false');
      }
      ti4.state.restricted = ti4.board.getAvailableHexes(tile);
      ti4.state.restricted.available.forEach(function(hex){
        hex.highlightClass('available');
      });
      ti4.state.restricted.unavailable.forEach(function(hex){
        hex.highlightClass('unavailable');
      });
    },
    
    boardClick:  function(tile){
      if ( ti4.lock ) { return }
      // console.log('clicked board tile: ', this.position);
      var boardTile = this.tile || tile;
      
      // if selected tile in hand can go to this board location
      if (ti4.state.restricted.available && ti4.state.restricted.available.indexOf(boardTile) > -1) {
        var handTile = ti4.state.selectedHandTile;
        eventHandlers.handClick(handTile);
        handTile.el.removeEventListener('mouseenter', eventHandlers.handMouseEnter);
        handTile.el.removeEventListener('click', eventHandlers.handClick);
        ti4.hand.layout.splice(handTile.position.hand, 1);
        ti4.hand.refresh();
        handTile.animateMoveTo(boardTile, 'placeHandTile',function(){
          handTile.addToBoard(boardTile.position.ring, boardTile.position.n);
          ti4.board.refresh();
        });
      }
    },
    
    boardMouseEnter:  function() {
      // console.log('hovering over board tile: ', this.system);
    }
  };
  
  var createTileElement = (function(){
    var createTileElement = function(system, tile){
      var raster = true;
    
      var url, element, container;
      if (raster){
        var tileNum = system.tileNumber;
        url = '/images/tiles/jpg/tile_' + tileNum + '.jpg';
        element = clipImage(url, 'idFixMe');
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
      container.tile = tile;
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
  
  // add this tile to board
  // after removing whatever is already there
  Tile.prototype.addToBoard = function(ring, n, rotation){
    var tile = this;
    // what is currently at ring, n?
    if ( ti4.board.layout[ring][n] != tile ) {
      ti4.board.layout[ring][n].el.remove();
      ti4.board.layout[ring][n] = tile;
    }
    tile.position.ring = ring;
    tile.position.n = n;
    this.position.hand = false;
    var pos = ti4.board.getHexPos(ring, n, rotation);
    ti4.board.el.appendChild(tile.el);
    tile.el.style.left = pos[0] + 'px';
    tile.el.style.top  = pos[1] + 'px';
    // clear any transform stuff
    tile.el.style.transform = '';
    tile.attachMouseEventsElement('board');
    tile.el.addEventListener('click', eventHandlers.boardClick);
    tile.el.addEventListener('mouseenter', eventHandlers.boardMouseEnter);
  };
  
  Tile.prototype.addToHand = function(i){
    var elTile = this.el;
    this.position.hand = i;
    ti4.hand.el.appendChild(elTile);
    var pos = ti4.hand.getHexPos(i);
    elTile.style.top = pos + 'px';
    this.attachMouseEventsElement('hand');
    this.el.addEventListener('click', eventHandlers.handClick);
    this.el.addEventListener('mouseenter', eventHandlers.handMouseEnter);
    this.el.addEventListener('mouseleave', eventHandlers.handMouseLeave);
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
  

  /**
   * moves tile to new location
   * @param to
   * this is horrible and needs rewriting
   */
  Tile.prototype.animateMoveTo = function(to, type, callback){
    var from, fromPos, toPos, dx, dy, ds;
    ti4.lock = true;
    from = this;
    fromPos = from.el.getBoundingClientRect();
    
    // if not already a position
    if ( isNaN(to.x) || isNaN(to.y) ) {
      // is element
      toPos = to.el.getBoundingClientRect();
      ds = to.el.clientWidth / from.el.clientWidth;
    } else { 
      toPos = to;
      ds = 1;
    }
    if ( type == 'refreshBoard' ) {
      var parent = from.el.parentNode;
      dx = toPos.x - fromPos.x + parent.getBoundingClientRect().x;
      dy = toPos.y - fromPos.y + parent.getBoundingClientRect().y;
    } else {
      dx = toPos.x - fromPos.x;
      dy = toPos.y - fromPos.y;
    }
    
    var defaultCallback = function(){
      // clear any transform stuff
      from.el.style.transition = 'none';
      from.el.style.transform = '';
      from.el.style.left = toPos.x + 'px';
      from.el.style.top  = toPos.y + 'px';
      
      // unlock animations
      ti4.lock = false;
      if (callback) { callback() };
    }
    from.el.addEventListener('transitionend', defaultCallback, {once: true});
    from.el.style.transition = 'all 0.5s ease-out';
    from.el.style.transformOrigin = 'top left';
    from.el.style.transform  = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + ds + ')';
  }
  
  
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
  
  Tile.prototype.rotate = function(rotation){
    var tile = this;
    console.log('rotating ', tile);
  }
  
  return Tile;
}());
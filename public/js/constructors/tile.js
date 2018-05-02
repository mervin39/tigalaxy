// returns tile constructor

ti4.Tile = (function(){
  
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
      
      var mouseEventsSvg = createMouseEventsSvg();
      
      container.appendChild(element);
      container.appendChild(mouseEventsSvg);
      return container;
    };
    
    function createMouseEventsSvg(){
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'mouse-events');
      svg.setAttribute('viewBox', '0 0 100 86.6');
      var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0,43.3 25,0 75,0 100,43.3 75,86.6 25,86.6');
      var handPolygon = '0,   43.3 ' +     
        '25,  0 ' +     // top left
        '75,  0 ' +     // top right
        '97,  38.3 ' +  // 
        '140, 38.3 ' +
        '140, 48.3 ' +
        '97,  48.3 ' +
        '75,  86.6 ' + // bottom right
        '25,  86.6 ';   // bottom left
      polygon.setAttribute('points', handPolygon);
      polygon.setAttribute('fill', 'transparent');
      svg.appendChild(polygon);
      return svg;
    }
    
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
  };
  
  Tile.prototype.addToBoard = function(){
    console.log('add tile to board');
  };
  
  Tile.prototype.addToHand = function(){
    
  };
  
  
  return Tile;
}());
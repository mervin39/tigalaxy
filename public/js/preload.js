// This file is run first
// and preloads tile data into global ti4 object.

(function(){
  var isLoaded = {
    json: false
  };
  fetch('json/systems.json', {method: 'get'})
    .then(function(res){
      res.json().then(function(data){
        ti4.systems = data;
        console.log('json loaded')
        isLoaded.json = true;
        checkEverythingIsLoaded();
      });
    })
    .catch(function(err){
      console.log('error', err);
    });
    
  function checkEverythingIsLoaded(){
    var finishedLoading = true;
    for ( let task in isLoaded ) {
      if ( !isLoaded[task] ) {
        finishedLoading = false;
      }
    }
    if ( finishedLoading ) {
      // run main site;
      console.log('all loaded');
      window.onload = ti4.run();
    }
  }
}())
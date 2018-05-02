// var json = require('./json/data.json')
var systems = require('./json/systems.json')
var bodies = require('./json/bodies.json')


for (var n in systems){
    var system = systems[n];
    system.tileNumber = n;
    system.bodies = [];
    for (var name of system.bodyNames) {
        var body = bodies[name];
        system.bodies.push(body);
    }
    delete(system.bodyNames);
}



module.exports = systems;
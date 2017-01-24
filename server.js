var Hapi = require('hapi'),
	CardStore = require('./lib/cardStore');

var server = new Hapi.Server();

//var cards = loadCards();
CardStore.initialize();

server.connection({ port:3000 });

server.register([require('inert'),require('vision')], function (err) {
	     if (err) console.log(err);
	 });

server.views({
	engines:{
		html: require('handlebars')
	},
	path: './templates'
});

/*const options {
		opsInterval: 5000,
		reporters: {
			file: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ request: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./__log.log']
        }]
		}

	};
server.register({
	register: require('good'),
	options : options
	
}, function(err){
	console.log(err);
});*/

server.register([
    // logging plugins
    {
        register: require('good'),
        options: {
            reporters: {
                console: [
                    {
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{response: '*', log: '*'}]
                    },
                    {module: 'good-console'},
                    'stdout'
                ]
            }
        }
    }
])

server.ext('onPreResponse', function(request, reply){
	if(request.response.isBoom){
		return reply.view('error',request.response);
	}
	reply.continue();
});

server.route(require('./lib/routes'));

server.start(function() {
	console.log('Listening on '+server.info.uri);
});

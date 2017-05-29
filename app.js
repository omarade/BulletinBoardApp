const express = require('express');
/*const fs = require('fs');*/
const app = express();
const bodyParser = require('body-parser');
const pg = require('pg')

app.set('views', __dirname + '/src/views');
app.set('view engine', 'pug');

app.use('/', bodyParser()) //creates key-value pairs request.body in app.post, e.g. request.body.username
app.use(express.static('src/public'))

/*const connectionString = "postgres://omar:12345@localhost/bulltinboard"*/
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'

app.get('/', function(req, res) {
	res.render('index')
})

app.post('/', function(req, res){
	var title = req.body.title
	var msg = req.body.message
	console.log('title', title)
	console.log('msg', msg)
	pg.connect(connectionString, function(err, client, done){

		// insert into messages (title, body) values ('title', 'msg');
		client.query("insert into messages (title, body) values ('" + title + "', '" + msg + "')", function(err){
			console.log('title', title)
			console.log('msg', msg)
			if (err){
				throw err
			}
			done()
			pg.end()
		})

	})
	res.render('index', {confirmation: 'Your message has been sent'})

})

app.get('/msg', function(req, res){
	pg.connect(connectionString, function(err, client, done){
		client.query('select body from messages', function(err, result){
			var msgs = result.rows

			done()
			pg.end()
			res.render('msgs', {msgs: msgs})
		})
	})
})

var listener = app.listen(3000, function () {
	console.log('Example app listening on port: ' + listener.address().port);
});
var express = require('express')
	, app = express.createServer()
	, io = require('socket.io').listen(app)
	, questions = []

app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger({ format: ':method :url' }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
});

app.get('/', function (req, res) {
	res.render('index');
});

app.post('/question', function (req, res) {
	var question = req.body.question
		, yesno = req.body.yesno
		, id = questions.length

	questions.push({ question: question, answers: [], yesno: yesno !== undefined });

	res.redirect('/question/' + id);
});

app.get('/question/:id', function (req, res) {
	if (req.params.id >= 0 && req.params.id < questions.length) {
		res.render('question', questions[req.params.id]);
	}
	else return res.end('error');
});

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

var port = process.env.PORT || 3000;
app.helpers({
	port: port
});

app.listen(port);

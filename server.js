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

	questions.push({ question: question, answers: [], yesno: yesno !== undefined , id: id });

	res.redirect('/question/' + id);
});

app.post('/answer/:id', function (req, res) {
	if (req.params.id >= 0 && req.params.id < questions.length) {
		var q = questions[req.params.id];
		q.answers.push(req.body.answer === 'yes');
		if (q.sockets) {
			for (var i in q.sockets) {
				q.sockets[i].emit('update', { id: req.params.id });
			}
		}
		res.end('ok');
	}
	else return res.end('error');
});

app.get('/answers/:id', function (req, res) {
	if (req.params.id >= 0 && req.params.id < questions.length) {
		res.partial('answers', { q: questions[req.params.id] });
	}
	else return res.end('error');
});

app.get('/question/:id', function (req, res) {
	if (req.params.id >= 0 && req.params.id < questions.length) {
		res.render('question', { q: questions[req.params.id] });
	}
	else return res.end('error');
});

io.sockets.on('connection', function (socket) {
	socket.on('listen', function (data) {
		if (data.id >= 0 && data.id <= questions.length) {
			questions[data.id].sockets = questions[data.id].sockets || [];
			questions[data.id].sockets.push(socket);
		}
	});
});

var port = process.env.PORT || 3000;
app.helpers({
	port: port
});

app.listen(port);

require(
	[ 'require'
	, 'jquery'
	, '/socket.io/socket.io.js'
	, '/lib/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {
			var port = $('body').data('port');
			var socket = io.connect('http://localhost:' + port);

			var answer = $('#answer');
			if (answer.length > 0) {
				answer.find('.btn').click(function () {
					var btn = $(this)
						, id = answer.data('id');
					$.post('/answer/' + id, { answer: btn.attr('id') }, function (data) {
						answer.empty();
						answer.load('/answers/' + id);
						socket.emit('listen', { id: id });
						socket.on('update', function (data) {
							answer.load('/answers/' + id);
						});
					});
				});
			}


		});
	}
);

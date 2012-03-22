require(
	[ 'require'
	, 'jquery'
	, '/socket.io/socket.io.js'
	, '/lib/js/bootstrap.min.js' ]
	, function (require, $) {
		$(function () {
			var port = $('body').data('port');
			var socket = io.connect('http://localhost:' + port);
			socket.on('news', function (data) {
				console.log(data);
			});


		});
	}
);

'use strict';

const PORT = 8002;
const FILENAME = './todos.json';

var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/todos', function(req, res) {
	fs.readFile(FILENAME, function(err, data) {
		var todos = JSON.parse(data);
		res.send(todos);
	});
});

app.post('/todos', function(req, res) {
	fs.readFile(FILENAME, function(err, data) {
		var todos = JSON.parse(data);
		todos.push(req.body);
		fs.writeFile(FILENAME, JSON.stringify(todos), function(err, data) {
			res.send();
		});
	});
});

app.delete('/todos/:index', function(req, res) {
	var index = req.params.index - 1;
	fs.readFile(FILENAME, function(err, data) {
		var todos = JSON.parse(data);
		todos.splice(index, 1);
		fs.writeFile(FILENAME, JSON.stringify(todos), function(err, data) {
			res.send();
		})
	})
});

app.post('/todos/update/:index', function(req, res) {
	var index = req.params.index - 1;
	fs.readFile(FILENAME, function(err, data) {
		var todos = JSON.parse(data);
		todos.forEach((elem, ind) => {
			if(ind === index)  elem.isComplete = !elem.isComplete;
		})
		fs.writeFile(FILENAME, JSON.stringify(todos), function(err, data) {
			res.send();
		});
	});
});

var server = http.createServer(app);

server.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}`);
});










 'use strict';

$(document).ready(init);

function init() {
	getAllTodos();
	$('#submit').click(addItem);
	$(document).on('click', '.remove', removeItem);
	$(document).on('click', '.completed', selectItem);
}

function getAllTodos() {
	$.ajax({
		method: 'GET',
		url: '/todos',
		success: function(todos) {
			$('.input').val('');
			$('.item:not(#template)').remove();
			var $todos = todos.map(function(todo) {
				var $todo = $('#template').clone();
				$todo.removeAttr('id');
				$todo.find('.desc').text(todo.desc);
				$todo.find('.dueDate').text(todo.dueDate);
				console.log('todo.isComplete: ' ,todo.isComplete);
				console.log('crossOff: ', $(this).hasClass('crossOff'))
				if(todo.isComplete === true) {
					console.log('$todo: ',$todo);
					$todo.children().addClass('crossOff');
					$todo.find('.compPic').removeClass('hide');
				}
				console.log('crossOff: ', $(this).hasClass('crossOff'))
				return $todo;
			});
			$('#todoTable').append($todos);
		}
	})
}

function addItem(event) {
	var descInput = $('#descInput').val();
	var dueInput = $('#dueInput').val();
	if(descInput && dueInput) {
		event.preventDefault();
		event.stopPropagation();
		var isComplete = false;
		$.ajax({
			url: '/todos',
			method: 'POST',
			data: {
				desc: descInput,
				dueDate: dueInput,
				isComplete: isComplete
			},
			success: function(data) {
				return getAllTodos();
			},
			error: function(err) {
				return console.error('err: ', err);
			}
		});
	}
}

function removeItem(event) {
	event.preventDefault();
	event.stopPropagation();
	var index = $(this).closest('.item').index();
	$(this).closest('.item').remove();
	$.ajax({
		url: `/todos/${index}`,
		method: 'DELETE',
		success: function(data) {
			return;
		},
		error: function(err) {
			return console.error(err);
		}
	})
}

function selectItem(event) {
	event.stopPropagation();
	var $this = $(this);
	$this.find('.compPic').toggleClass('hide');
	$this.closest('.item').children().toggleClass('crossOff');
	var index = $(this).closest('.item').index();
	var descInput = $('#descInput').val();
	var dueInput = $('#dueInput').val();
	var isComplete;
	if($(this).find('.compPic').hasClass('.hide')) {
		isComplete = false;
	} else {
		isComplete = true;
	}
	$.ajax({
		url: `/todos/update/${index}`,
		method: 'POST',
		data: {
			desc: descInput,
			dueDate: dueInput,
			isComplete: isComplete
		},
		success: function(data) {
			return;
		},
		error: function(err) {
			return console.error('err: ', err);
		}
	});
}
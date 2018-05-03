'use strict';
var app = {
	lst_id: null,
//     isLoading: true,
//     spinner: document.querySelector('.loader'),
//     container: document.querySelector('.main'),
};

function addItem() {
	try {
		let obj = {name: $('#input').val()};

		if (app.lst_id) {
			obj.lst_id = app.lst_id;
		}

		let title = app.lst_id? 'Item' : 'Lista';

		bootbox.confirm({
			title: 'Adicionar ' + title,
			message: '<input id="input" class="form-control" placeholder="Novo '+ title +'">',
			buttons: {
				cancel: {
					label: 'Cancelar',
					className: 'btn-default'
				},
				confirm: {
					label: 'Salvar',
					className: 'btn-primary'
				}
			},
			callback: function (result) {
				if (result) {
					let obj = {};
					obj.name = document.getElementById('input').value;
					if (app.lst_id) {
						obj.lst_id = app.lst_id;
						obj.done = false;
					}
					saveItem(obj);
					showItems();
				}
			}
		});
		$('.modal').on('shown.bs.modal', function () {
		  $('#input').focus();
		})
	} catch (exp) {
		throw console.log("Sorry... Error:" + exp);
	}
}

function showItems() {
	$('#listing').text('');
	getList(app.lst_id);
}

function enterList(id) {
	$('#listing').text('');

	if (id) {
		getItemData(id, function(data) {
	        $('#brand').text(data.name);
		    $('#navigation').removeClass('glyphicon-home').addClass('glyphicon-menu-left');
		});
		app.lst_id = id;
	} else {
		app.lst_id = '';
	    $('#brand').text('Listas');
	    $('#navigation').addClass('glyphicon-home').removeClass('glyphicon-menu-left');
	}
	getList(app.lst_id);
}

function setDel(id) {
	let msg = 'Tem certeza que deseja deletar essa lista? Pois deletará também todos os itens cadastrados.';

	if (app.lst_id) {
		msg = 'Tem certeza que deseja deletar esse item?';
	}

	bootbox.confirm({
		message: msg,
		buttons: {
			confirm: {
				label: 'Sim',
				className: 'btn-danger'
			},
			cancel: {
				label: 'Não',
				className: 'btn-default'
			}
		},
		callback: function (result) {
			if (result) {
				delItem(id);
				showItems();
			}
		}
	});
}

function setEdit(id) {
	getItemData(id, function(data){
		bootbox.confirm({
			title: app.lst_id? 'Editar Item' : 'Editar Lista',
			message: '<input id="input" value="'+ data.name +'" class="form-control">',
			buttons: {
				confirm: {
					label: 'Salvar',
					className: 'btn-primary'
				},
				cancel: {
					label: 'Cancelar',
					className: 'btn-default'
				}
			},
			callback: function (result) {
				if (result) {
					data.name = $('.bootbox').find('#input').val();
					data.id = id;
					editItem(data);
					showItems();
				}
			}
		});
		$('.modal').on('shown.bs.modal', function () {
		  $('#input').focus();
		})
	});
}

function mountItems(value) {
	console.log("VALUE");
	console.log(value);
    let item = '<div clas="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
    // checkbox
    let aux = 'onclick="enterList('+ value.id +')"';
    let done;

    if (app.lst_id) {
    	aux = 'id="item_'+ value.id +'"';
	    done = value.done? 'done' : '';
	    let check = value.done? 'checked="true"': '';
	    item += '<input id="'+ value.id +'" class="chb" type="checkbox" onclick="checkItem('+ value.id +')" '+ check +'>&nbsp;&nbsp;&nbsp;';
    }
    // name item
    item += '<a '+ aux +' class="font20 item '+ done +'" >' + value.name + '</a>';
    // del item
    item += '<a class="text-danger pull-right" onclick="setDel('+ value.id +')">';
    item += '<i class="font21 glyphicon glyphicon-trash"></i></a>';
    item += '<a class="col-sm-1 pull-right"></a>';
    // edit item
    item += '<a class="font21 text-info pull-right" onclick="setEdit('+ value.id +')">';
    item += '<i class="glyphicon glyphicon-edit"></i></a></div>';
    $('#listing').prepend(item);
}

function checkItem(id) {
	let done;
	if ($('#'+id).is(':checked')) {
		$('#item_'+id).addClass('done');
		done = true;
	} else {
		$('#item_'+id).removeClass('done');
		done = false;
	}

	getItemData(id, function(data){
		data.done = done;
		editItem(data);
	});
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./service-worker.js')
           .then(function() { console.log('Service Worker Registered'); });
}

$(document).ready(function() {
	let date = new Date().getFullYear()
	console.log(".__________________________________.");
	console.log("|      "+date + " minimal.com v1.0.0     |")
	console.log("|    Developed by Victor Barreto   |");
	console.log("| victor.eduardo.barreto@gmail.com |");
	console.log(".__________________________________.");
});

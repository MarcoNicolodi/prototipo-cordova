$(document).ready(function(){
	setInterval(function(){
	    if(navigator.onLine){
			$("#connectionAdvisor").removeClass("offline");
	        $("#connectionAdvisor").addClass("online");
			console.log("On");
	    } else {
			$("#connectionAdvisor").removeClass("online");
			$("#connectionAdvisor").addClass("offline");
			console.log("Off");
	    }
	},1000);
});

var ip = localStorage.getItem('ip');

function setIp(){
	localStorage.setItem('ip',$('#ip').val());
	var ip = localStorage.getItem('ip');
	$("#ip").attr("placeholder", ip);
	console.log(localStorage.getItem('ip'));
	console.log(ip);
}

function loadPage2(url,callback){
	$.ajax({
		url: url,
		success: function(data){
			$("#app").html(data);
			if (callback && typeof callback === 'function'){
				callback();
			}
		},
		error: function(e){
			console.log(JSON.stringify(e));
			$("#app").html("<p>Ocorreu um erro ao tentar carregar a página. Por favor, tente novamente</p>");
		}
	});
}

//inicia variaveis do localStorage
var tbPropriedades = localStorage.getItem("tbPropriedades");
tbPropriedades = JSON.parse(tbPropriedades);
if(tbPropriedades == null){
	tbPropriedades = [];
}

function adicionar(){
	var propriedade = JSON.stringify({
		nome             :$("#nome").val(),
		tamanho          :$("#tamanho").val(),
		usuario_id       :$("#usuario_id").val(),
		cidade_id        :$("#cidade_id").val(),
		endereco         :$("#endereco").val()
	});

	tbPropriedades.push(propriedade);
	localStorage.setItem("tbPropriedades", JSON.stringify(tbPropriedades));
	console.log("Propriedade adicionada.");
	toastr.warning("Armazenado no dispositivo");
	loadPage2('welcome.html');
}

function listar(){
	$("#tblListar").html("");
	$("#tblListar").html(
		"<thead>"+
		"	<tr>"+
		"	<th></th>"+
		"	<th>Nome</th>"+
		"	<th>Tamanho</th>"+
		"	<th>ID Usuário</th>"+
		"	<th>ID Cidade</th>"+
		"	<th>Endereço</th>"+
		"	</tr>"+
		"</thead>"+
		"<tbody>"+
		"</tbody>"
		);
	for(var i in tbPropriedades){
		var p = JSON.parse(tbPropriedades[i]);
		$("#tblListar tbody").append("<tr>");
		$("#tblListar tbody").append("<td data-title='Nome'>"+p.nome+"</td>");
		$("#tblListar tbody").append("<td data-title='Tamanho'>"+p.tamanho+"</td>");
		$("#tblListar tbody").append("<td data-title='Usuario'>"+p.usuario_id+"</td>");
		$("#tblListar tbody").append("<td data-title='Cidade'>"+p.cidade_id+"</td>");
		$("#tblListar tbody").append("<td data-title='Endereço'>"+p.endereco+"</td>");
		$("#tblListar tbody").append("</tr>");
	}
}

function sync(){
	for (var i in tbPropriedades){
		console.log(tbPropriedades[i]);
		console.log(JSON.parse(tbPropriedades[i]));
		console.log(JSON.stringify(tbPropriedades[i]));
		$.ajax({
			type: "post",
			url: 'http://'+ip+'/epagri3/propriedades/add.json',
			data: JSON.parse(tbPropriedades[i]),
			dataType: "json",
			crossDomain: true,
			success: function(data){
				console.log(data);
				toastr.success("Sincronizado com sucesso");
			},
			error: function(e){
				console.error("ERRO:"+JSON.stringify(e));
				toastr.error("Ocorreu um erro ao sincronizar");
			}
		});
	}
	localStorage.clear();
}



//window.addEventListener('load',checkIfConnected);
// console.log("oi");
// setInterval(function(){
//     if(navigator.onLine){
//         document.getElementById("connectionAdvice").innerHTML = "Online";
//         document.getElementById("connectionAdvice").className= "online";
//     } else {
//         document.getElementById("connectionAdvice").innerHTML = "Offline";
//         document.getElementById("connectionAdvice").className = "offline";
//     }
//
// },1000);

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
		$.ajax({
			type: "post",
			url: 'http://localhost/epagri3/propriedades/add.json',
			data: tbPropriedades[i],
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
	//localStorage.clear();
}

function loadPage(url) {
    var xmlhttp = new XMLHttpRequest();

    // Callback function when XMLHttpRequest is ready
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState === 4){
            if (xmlhttp.status === 200) {
                document.getElementById('app').innerHTML = xmlhttp.responseText;
                    document.getElementById("form").addEventListener("submit",function(e){
                            jQuery.support.cors = true;
                            e.preventDefault();
                            $.ajax({
                                type: "post",
                                url: url,
                                data: {nome: $("input[name='nome']").val(),tamanho: $("input[name='tamanho']").val(),usuario_id: $("input[name='usuario_id']").val(),cidade_id: $("input[name='cidade_id']").val(),endereco:$("input[name='endereco']").val()},
                                dataType: "json",
                                crossDomain: true,
                                success: function(data){
                                    console.log(data);
                                },
                                error: function(e){
                                    console.error("ERRO:"+JSON.stringify(e));
                                }
                            })
                            // $.ajax({
                            //     type: "get",
                            //     url: "http://localhost/epagri3/propriedades.json",
                            //     //data: {nome: $("input[name='nome']").val(),tamanho: $("input[name='tamanho']").val(),usuario_id: $("input[name='usuario_id']").val(),cidade_id: $("input[name='cidade_id']").val()},
                            //     //dataType: "json",
                            //     crossDomain: true,
                            //     success: function(data){
                            //         console.log(data);
                            //     },
                            //     error: function(e){
                            //         console.error("ERRO:"+JSON.parse(e));
                            //     }
                            // })

    // $.ajax({
    //     url: 'http://localhost/webservice/livros',
    //     success: function(data){
    //         var content;
    //         content = "<table class='table table-striped'><thead><tr>" +
    //                   "<th>Nome</th>  <th>Gênero</th><th>Autor</th>" +
    //                   "<th>Preço</th><th>Ações</th></tr></thead><tbody>"
    //         $.each(data,function(k,v){
    //             content+="<tr>" +
    //                     '<td>'+v.nomelivro+'</td>'+
    //                     '<td>'+v.generolivro+'</td>'+
    //                     '<td>'+v.idautor+'</td>'+
    //                     '<td>'+v.precolivro+'</td>'+
    //                     "</tr>";
    //         });
    //         content+="</tbody></table>";
    //         $("#display").append(content);
    //
    //     },
    //     error: function(e){
    //         console.log("Error: "+e);
    //     }
    // });


                    });
            }
        }
    };
    xmlhttp.open("GET", url , true);
    xmlhttp.send();
}

//$("#linkCadastrar").on('click',loadPage2('form.html'));

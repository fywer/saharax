'use strict'
import handler from "./util/handler.js";
import util from "./util/util.js";
import { Gasto } from "./modules/gasto.js";

if (sessionStorage.getItem("token") == null) {
	alertify.warning("El usuario no ha sido autentificado. Por favor, inicie sessión.");
	window.location.replace('/')
} else util.accessValidate();

const displayCategorias = (categorias) => {
	const selecategorias = document.querySelector("#selecategorias");
	categorias.forEach( categoria => {
		let itemOption = document.createElement("option");		
		itemOption.setAttribute('value', categoria.id);
		itemOption.appendChild(document.createTextNode(categoria.dsCategoria));
		selecategorias.appendChild(itemOption);
	});
} 		
const getCategorias = () => {
	const url = '/categoria';
	const request = {
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept': 'application/json',
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseJson).
	then(displayCategorias).
	catch(handler.error);
}
const displayGastoDialog = (gasto) => {
	const selecategorias = document.querySelector("#selecategorias");
	for (let i = 0; i < selecategorias.length; i ++) {
		if (selecategorias[i].text === gasto.getCategoria.getDsCategoria) {
			selecategorias[i].selected = true;
		}
	}	
	document.getElementById("btonidgasto").value = gasto.getId;
	document.getElementById("btonfechagasto").value = gasto.getUltimaActualizacion;
	document.getElementById("nmromonto").value = gasto.getMonto.toFixed(2);
	document.getElementById("textdsgasto").value = gasto.getDsGasto;
	$.mobile.changePage( "#gastodialog", {
		role : 'dialog'
	});
}
const createItemList = (gasto) => {
	let itemList = document.createElement("li");
	itemList.setAttribute('id', gasto.getId);
	let itemLink = document.createElement("a");
	let itemSubtitle = document.createElement("h2");
	itemSubtitle.appendChild(document.createTextNode(gasto.getCategoria.getDsCategoria));
	itemLink.appendChild(itemSubtitle);
	let itemParagraphDs = document.createElement("p");
	itemParagraphDs.appendChild(document.createTextNode(gasto.getDsGasto));
	itemLink.appendChild(itemParagraphDs);
	let itemParagraphMonto = document.createElement("p");
	itemParagraphMonto.setAttribute('class', "ui-li-aside");
	let itemStrong = document.createElement("strong");
	itemStrong.appendChild(document.createTextNode(gasto.getMontoFomat));
	itemParagraphMonto.appendChild(itemStrong);
	itemLink.appendChild(itemParagraphMonto);
	itemLink.addEventListener("click", () => {
		const url = "/gasto".concat("/"+gasto.getId);
		const request = {
			method : 'GET',
			headers : {
				'Authorization' : sessionStorage.getItem("token")	
			}
		}
		fetch(url, request).
		then(handler.responseJson).
		then(Gasto.parseGasto).
		then(displayGastoDialog).
		catch(handler.error);
	});
	itemList.appendChild(itemLink);
	return itemList;
}
const createItemListDivider = (gasto, sumatoriapordia) => {
	let itemList = document.createElement("li");
	itemList.setAttribute('data-role', "list-divider");
	itemList.setAttribute('style', "background: #099268; color: #FFF; text-shadow: none;");
	let mensaje = `${gasto.getDiaSemanaFormat}, ${gasto.getDia} de ${gasto.getMesFormat}`
	itemList.appendChild(document.createTextNode(mensaje));
	let itemspansumapordia = document.createElement("span");
	itemspansumapordia.setAttribute('class', 'ui-li-count');
	itemspansumapordia.appendChild(document.createTextNode("$" + sumatoriapordia.toFixed(2)));
	itemList.appendChild(itemspansumapordia);
	return itemList;
}
const createItemListView  = (gastospormes) => {
	let itemListView = document.createElement("ul");
	itemListView.setAttribute('data-role', 'listview');	
	let dia = gastospormes[0].getDia;
	let sumatoriapordia = 0;
	let itemsListOfGasto = [];
	let i = 0;
	for (;i < gastospormes.length; i++) {
		if(dia != gastospormes[i].getDia) {
			i = i - 1; //le resto el indice porque la condicional hace que el gasto actual se omita.
			let itemListDivider = createItemListDivider(gastospormes[i], sumatoriapordia);
			itemListView.appendChild(itemListDivider); //añado la división de los gastos con la sumatoria por día.
			itemsListOfGasto.forEach( itemListGasto => {
				itemListView.appendChild(itemListGasto);	
			});
			itemsListOfGasto = [];	
			sumatoriapordia = 0;
			dia = dia + 1;
		} else {
			sumatoriapordia += gastospormes[i].getMonto;
			let itemListGasto = createItemList(gastospormes[i]);
			itemsListOfGasto.push(itemListGasto);
		}
	}
	if (itemsListOfGasto.length > 0) { //puede ser que se haya quedado gastos despues de terminar el recorrido de gastos.
		i = i - 1; //le resto el indice porque la condicional hace que el gasto actual se omita.
		let itemListDivider = createItemListDivider(gastospormes[i], sumatoriapordia);
		itemListView.appendChild(itemListDivider); //añado la división de los gastos con la sumatoria por día.
		itemsListOfGasto.forEach( itemListGasto => {
			itemListView.appendChild(itemListGasto);	
		});
	}
	return itemListView;
}
const displayGastos = (data) => {
	const setgastos = document.querySelector("#setgastos");
	while (setgastos.firstChild){
 		setgastos.removeChild(setgastos.firstChild);
	};	
	data.forEach(gastospormes => {
		let indicemes = 0;
		let agrupado = false;
		if(gastospormes.length > 0) {
			let itemCollapsible = document.createElement("div");
			itemCollapsible.setAttribute('data-role',"collapsible");
			if (agrupado == false) {
				let itemParagraphMes = document.createElement("h2");
				let objtemp = gastospormes[indicemes]; //exclusivo para obtener el mes y año
				itemParagraphMes.appendChild(document.createTextNode(`${objtemp.getMesFormat} ${objtemp.getAnio}`));
				itemCollapsible.appendChild(itemParagraphMes);
				agrupado = true;
				indicemes += 1;
			}
			let itemListView = createItemListView(gastospormes);	
			itemCollapsible.appendChild(itemListView);
			setgastos.appendChild(itemCollapsible);
		}
	});
	$("#setgastos").collapsibleset().trigger("create")
} 
const getGastos = () => {
	const url = '/gasto';
	const request = {
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept' : 'application/json',
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseJson).
	then(Gasto.parseGastos).
	then(Gasto.agruparGastosPorMes).
	then(displayGastos).	
	catch(handler.error);
}
const updateGasto = (event) => {
	document.querySelector("[form=formactualizargasto]").disabled = true;
	const url = '/gasto';
	event.preventDefault();
	let idGasto = parseInt( document.getElementById("btonidgasto").value, 10 ); 
	let idCategoria = parseInt( document.getElementById('selecategorias').value, 10 );
	let ultimaActualizacion = document.getElementById('btonfechagasto').value;
	let monto = parseFloat(document.getElementById('nmromonto').value);
	let textdsgasto = document.getElementById('textdsgasto').value;
	let dsGasto = util.stringCleaner(new String(textdsgasto));
	try{
		if (dsGasto.length < 2 || dsGasto.length > 100) {
			alertify.warning("La descripción debe tener al menos 2 caracteres y menos de 100.");
			throw "La descripción debe tener al menos 2 caracteres y menos de 100.";
		}	
	} catch (e) {
		console.warn(e);
		document.querySelector("[form=formactualizargasto]").disabled = false;
		return;
	}
	const payload = {
		'id' : idGasto,
		'dsGasto' : dsGasto,
		'monto' : monto,
		'ultimaActualizacion' : ultimaActualizacion,
		'categoria' : {
			'id' : idCategoria
		}
	}
	const request = {
		method : 'PUT',
		body : JSON.stringify(payload),
		headers: {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept' : 'application/json',
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseJson).
	then( data => {
		alertify.success("Se ha actualizado con exito el gasto.");
		$.mobile.changePage( "#leergastos", {
			role : 'page'
		});
		document.querySelector("[form=formactualizargasto]").disabled = false;
	}).
	catch(handler.error)
}
const deleteGasto = (event) => {
	document.querySelector("[id=btoneliminargasto]").disabled = true;
	document.querySelector("[form=formactualizargasto]").disabled = true;
	alertify.confirm("¿Esta seguro de eliminar el gasto?",
	() => { 
		const idGasto = document.getElementById("btonidgasto").value;
		const url = "/gasto".concat("/"+idGasto);
		const request = {
			method : 'DELETE',
			headers : {
				'Authorization' : sessionStorage.getItem("token")
			}		
		}
		fetch(url, request).
		then(handler.responseText).
		then( () => {
			document.getElementById(idGasto).remove();
			let data = JSON.parse(localStorage.getItem("gastos"));
			let gastospormes = [];
			let datatemp = [];
			data.forEach(gastos => {
				for(let i=0; i < gastos.length; i++) {
					if ( gastos[i].id !== parseInt(idGasto) )
						gastospormes.push(new Gasto().parser(gastos[i]));	
				}
				datatemp.push(gastospormes);
				gastospormes = [];
			});
			localStorage.setItem('gastos', JSON.stringify(datatemp));
			document.querySelector("[id=btoneliminargasto]").disabled = false;					
			document.querySelector("[form=formactualizargasto]").disabled = false;
			displayGastos(datatemp);
			$.mobile.changePage( "#leergastos", {
				role : 'page'
			});
		}).
		catch(handler.error);
	},
	() => {
		document.querySelector("[id=btoneliminargasto]").disabled = false;
		document.querySelector("[form=formactualizargasto]").disabled = false;
		return;
	});
}
window.addEventListener('load', (event) => {
	getGastos();
	const btoncreargasto = document.getElementById("btoncreargasto");
	btoncreargasto.addEventListener("click", () => {
		window.location.replace("/creargasto")
	});
	getCategorias();
	const btonhome = document.getElementById('btonhome');
	btonhome.addEventListener("click", () => {
		window.location.replace("/home")
	});
}); 

$(document).on("pageshow", "#gastodialog", (data) => {
	$("#selecategorias").selectmenu("refresh");
	const formactualizargasto = document.getElementById("formactualizargasto");
	formactualizargasto.addEventListener("submit", updateGasto);
	const btoneliminargasto = document.getElementById("btoneliminargasto");
	btoneliminargasto.addEventListener("click", deleteGasto);
});
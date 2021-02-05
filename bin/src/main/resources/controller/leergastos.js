'use strict'
import handler from "./util/handler.js";
import util from "./util/util.js";
import { Gasto } from "./modules/gasto.js";

const displayCategorias = (categorias) => {
	const selecategorias = document.querySelector("#formactualizargasto #selecategorias");
	while (selecategorias.firstChild){
 		selecategorias.removeChild(selecategorias.firstChild);
	};
	categorias.forEach( categoria => {
		let itemOption = document.createElement("option");		
		itemOption.setAttribute('value', categoria.id);
		itemOption.appendChild(document.createTextNode(categoria.dsCategoria));
		selecategorias.appendChild(itemOption);
	});
	return new Promise( resolve => {
		resolve(selecategorias);
	});
} 		
const displayGasto = (gasto) => {
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
	then(selecategorias => {
		for (let i = 0; i < selecategorias.length; i ++) {
			if (selecategorias[i].text === gasto.getCategoria.getDsCategoria) {
				selecategorias[i].selected = true;
			}
		}	
		document.querySelector("#formactualizargasto #btonidgasto").value = gasto.getId;
		document.querySelector("#formactualizargasto #btonfechagasto").value = gasto.getUltimaActualizacion;
		document.querySelector("#formactualizargasto #nmromonto").value = gasto.getMonto.toFixed(2);
		document.querySelector("#formactualizargasto #textdsgasto").value = gasto.getDsGasto;
		$.mobile.changePage( "#gasto", {
			role : 'page',
			domCache: false
		});
	}).
	catch(handler.error);
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
		then(displayGasto).
		catch(handler.error);
	});
	itemList.appendChild(itemLink);
	return itemList;
}
const createItemListDivider = (diadelgasto, sumatoriapordia) => {
	let itemList = document.createElement("li");
	itemList.setAttribute('data-role', "list-divider");
	itemList.setAttribute('style', "background: #099268; color: #FFF; text-shadow: none;");
	itemList.appendChild(document.createTextNode(diadelgasto));
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
	//gastospormes.length;
	for (;i < gastospormes.length; i++) {
		if(dia != gastospormes[i].getDia) {
			if (sumatoriapordia == 0) continue
			i = i - 1; //le resto el indice porque la condicional hace que el gasto actual se omita.
			let gastotemp = gastospormes[i];
			let diadelgasto = `${gastotemp.getDiaSemanaFormat}, ${gastotemp.getDia} de ${gastotemp.getMesFormat}`
			let itemListDivider = createItemListDivider(diadelgasto, sumatoriapordia);
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
		let gastotemp = gastospormes[i];
		let diadelgasto = `${gastotemp.getDiaSemanaFormat}, ${gastotemp.getDia} de ${gastotemp.getMesFormat}`
		let itemListDivider = createItemListDivider(diadelgasto, sumatoriapordia);
		itemListView.appendChild(itemListDivider); //añado la división de los gastos con la sumatoria por día.
		itemsListOfGasto.forEach( itemListGasto => {
			itemListView.appendChild(itemListGasto);	
		});
	}
	return itemListView;
}
const displayGastos = (data) => {
	console.warn(data);
	const setgastos = document.querySelector("#setgastos");
	while (setgastos.firstChild){
 		setgastos.removeChild(setgastos.firstChild);
	};	
	data.forEach(gastospordia => {
		let indicedia = 0;
		let agrupado = false;
		if(gastospordia.length > 0) {
			let itemCollapsible = document.createElement("div");
			itemCollapsible.setAttribute('data-role',"collapsible");
			itemCollapsible.setAttribute('data-mini', "true");
			if (agrupado == false) {
				let itemParagraphDia = document.createElement("h2");
				let gastotemp = gastospordia[indicedia];
				let diadelgasto = `${gastotemp.getDia} de ${gastotemp.getMesFormat}`
				itemParagraphDia.appendChild(document.createTextNode(diadelgasto));
				itemCollapsible.appendChild(itemParagraphDia);
				agrupado = true;
				indicedia += 1;
			}
			let itemListView = createItemListView(gastospordia);	
			itemCollapsible.appendChild(itemListView);
			setgastos.appendChild(itemCollapsible);
		}
	});
	$("#setgastos").collapsibleset().trigger("create")
} 
const getGastos = () => {
	const url = '/gasto/year/2021?mes=1'
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
	then(Gasto.agruparGastosPorDia).
	then(displayGastos).	
	catch(handler.error);
}
const updateGasto = (event) => {
	document.querySelector("[form=formactualizargasto]").disabled = true;
	const url = '/gasto';
	event.preventDefault();
	let idGasto = parseInt(document.querySelector("#formactualizargasto #btonidgasto").value, 10 ); 
	let idCategoria = parseInt( document.querySelector("#formactualizargasto #selecategorias").value, 10 );
	let ultimaActualizacion = document.querySelector("#formactualizargasto #btonfechagasto").value;
	let monto = parseFloat(document.querySelector("#formactualizargasto #nmromonto").value);
	let textdsgasto = document.querySelector("#formactualizargasto #textdsgasto").value;
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
		document.querySelector("[form=formactualizargasto]").disabled = false;
		$.mobile.changePage( "#leergastos", {
			role : 'page'
		});
	}).
	catch(handler.error)
}
const deleteGasto = (event) => {
	event.preventDefault();
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
$(document).on("pageshow", "#leergastos", (data) => {
	getGastos();
});

$(document).on("pageshow", "#gasto", (data) => {
	$("#formactualizargasto #selecategorias").selectmenu("refresh");
	const formactualizargasto = document.getElementById("formactualizargasto");
	formactualizargasto.addEventListener("submit", updateGasto);
	const btoneliminargasto = document.getElementById("btoneliminargasto");
	btoneliminargasto.addEventListener("click", deleteGasto);
});
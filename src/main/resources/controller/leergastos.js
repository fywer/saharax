'use strict'
import handler from "./util/handler.js";
import util from "./util/util.js";
import { Gasto } from "./modules/gasto.js";

const displayCategorias = (categorias) => {
	const selecategorias = document.querySelector("#selecategorias");
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
		document.querySelector("#btonidgasto").value = gasto.getId;
		document.querySelector("#btonfechagasto").value = gasto.getUltimaActualizacion;
		document.querySelector("#nmromonto").value = gasto.getMonto.toFixed(2);
		document.querySelector("#textdsgasto").value = gasto.getDsGasto;}).
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
	let itemStrong = document.createElement("strong");
	itemStrong.appendChild(document.createTextNode(gasto.getMontoFomat));
	itemParagraphMonto.appendChild(itemStrong);
	itemLink.appendChild(itemParagraphMonto);
	itemLink.addEventListener("click", () => {
		document.querySelector("#modalmodificargasto").className = "modal is-active"; 
		const btonactualizargasto = document.getElementById("btonactualizargasto");
		btonactualizargasto.addEventListener("click", updateGasto);
		const btoneliminargasto = document.getElementById("btoneliminargasto");
		btoneliminargasto.addEventListener("click", deleteGasto);
		
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
	itemList.setAttribute('class', "list");
	itemList.setAttribute('style', "background: #099268; color: #FFF; text-shadow: none;");
	itemList.appendChild(document.createTextNode(diadelgasto));
	let itemspansumapordia = document.createElement("span");
	itemspansumapordia.setAttribute('style', "position: absolute;right: 4em;background: red; color: #f6f6f6; border-radius: .5em;padding: .2em; font-weight: bold; font-size: .7em;");
	itemspansumapordia.appendChild(document.createTextNode("$" + sumatoriapordia.toFixed(2)));
	itemList.appendChild(itemspansumapordia);
	return itemList;
}
const createItemListView  = (gastospormes) => {
	let itemListView = document.createElement("ul");
	itemListView.setAttribute('class', 'list');	
	let dia = gastospormes[0].getDia;
	let sumatoriapordia = 0;
	let itemsListOfGasto = [];
	let i = 0;
	for (;i < gastospormes.length; i++) {
		if(dia != gastospormes[i].getDia) {
			if (sumatoriapordia == 0) continue
			i = i - 1; //le resto el indice porque la condicional hace que el gasto actual se omita.
			let gastotemp = gastospormes[i];
			let diadelgasto = `${gastotemp.getDiaSemanaFormat}, ${gastotemp.getDia} de ${gastotemp.getMesFormat}`
			let itemListDivider = createItemListDivider(diadelgasto, sumatoriapordia);
			itemListView.appendChild(itemListDivider); //a�ado la divisi�n de los gastos con la sumatoria por d�a.
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
		itemListView.appendChild(itemListDivider); //a�ado la divisi�n de los gastos con la sumatoria por d�a.
		itemsListOfGasto.forEach( itemListGasto => {
			itemListView.appendChild(itemListGasto);	
		});
	}
	return itemListView;
}
const displayGastos = (data) => {
	const setgastos = document.querySelector("#setgastos");
	util.componentCleaner(setgastos);
	data.forEach(gastospordia => {
		let indicedia = 0;
		let agrupado = false;
		if (gastospordia.length > 0) {
			let itemCollapsible = document.createElement("div");
			itemCollapsible.setAttribute('class',"control");
			if (agrupado == false) {
				let gastotemp = gastospordia[indicedia];
				let diadelgasto = `${gastotemp.getDia} de ${gastotemp.getMesFormat}`
				agrupado = true;
				indicedia += 1;
			}

			let itemListView = createItemListView(gastospordia);	
			itemCollapsible.appendChild(itemListView);
			setgastos.appendChild(itemCollapsible);
		}
	});
} 
const getGastos = (anio, mes) => {
	const url = "/gasto/year/".concat(anio)+"?mes=".concat(mes)
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
	event.preventDefault();
	document.querySelector("#btoneliminargasto").disabled = true;
	document.querySelector("#btonactualizargasto").disabled = true;
	const url = '/gasto';
	let idGasto = parseInt(document.querySelector("#btonidgasto").value, 10 ); 
	let idCategoria = parseInt( document.querySelector("#selecategorias").value, 10 );
	let ultimaActualizacion = document.querySelector("#btonfechagasto").value;
	let monto = parseFloat(document.querySelector("#nmromonto").value);
	let textdsgasto = document.querySelector("#textdsgasto").value;
	let dsGasto = util.stringCleaner(new String(textdsgasto));
	try{
		if (dsGasto.length < 2 || dsGasto.length > 100) {
			alertify.warning("La descripción debe tener al menos 2 caracteres y menos de 100.");
			throw "La descripción debe tener al menos 2 caracteres y menos de 100.";
		}	
	} catch (e) {
		console.warn(e);
		document.querySelector("#btonactualizargasto").disabled = false;
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
		alertify.success("Se ha actualizado con exito el gasto.", 2, () => {
			window.location.replace('/home/gastos');	
		});
	}).
	catch(handler.error)
}
const deleteGasto = (event) => {
	event.preventDefault();
	document.querySelector("#btoneliminargasto").disabled = true;
	document.querySelector("#btonactualizargasto").disabled = true;
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
			alertify.success("Se ha eliminado con exito el gasto.", 2, () => {
				window.location.replace('/home/gastos');
			});
		}).
		catch(handler.error);
	},
	() => {
		document.querySelector("#btoneliminargasto").disabled = false;					
		document.querySelector("#btonactualizargasto").disabled = false;
		return;
	});
}

const displayYears = (anios) => {
	const seleanios = document.querySelector("#formbuscargasto #seleanios");
	util.componentCleaner(seleanios);
	let primerValor = false;
	let indice = 0;
	do {
		let itemOption = document.createElement('option');
		if (primerValor == true) {
			itemOption.setAttribute('value', anios[indice]);
			itemOption.appendChild(document.createTextNode(anios[indice]));	
			seleanios.appendChild(itemOption)
		} else {
			itemOption.setAttribute('value', 0);
			itemOption.appendChild(document.createTextNode("Seleccionar"));
			primerValor = true;
			seleanios.appendChild(itemOption)
			continue;	
		}
		indice += 1;
	} while(indice < anios.length);
	return new Promise( resolve => {
		resolve(document.querySelector("#formbuscargasto #selemeses"));
	});
}

const displayMeses = (meses) => {
	const selemeses = document.querySelector("#formbuscargasto #selemeses");
	util.componentCleaner(selemeses);
	let primerValor = false;
	let indice = 0;
	do {
		let itemOption = document.createElement('option');
		if (primerValor == true) {
			itemOption.setAttribute('value', meses[indice]);
			itemOption.appendChild(document.createTextNode(util.mesFormat( meses[indice] ) ));	
			selemeses.appendChild(itemOption)
		} else {
			itemOption.setAttribute('value', 0);
			itemOption.appendChild(document.createTextNode("Seleccionar"));
			primerValor = true;
			selemeses.appendChild(itemOption)
			continue;	
		}
		indice += 1;
	} while(indice < meses.length);
}

const getUltimateYears = () => {
	const url = "/gasto/years";
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
	then(displayYears).
	then( selemeses => {
		util.componentCleaner(selemeses);
		let itemOption = document.createElement('option');
		itemOption.setAttribute('value', 0);
		itemOption.appendChild(document.createTextNode("Seleccionar"));
		selemeses.appendChild(itemOption);
	}). 
	catch(handler.error);
}
const getMonths = (anio) => {
	const url = "/gasto/months/".concat(anio);
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
	then(displayMeses).
	catch(handler.error);
}

window.addEventListener("load", event => {
	const seleanios = document.querySelector("#formbuscargasto #seleanios");
	const selemeses = document.querySelector("#formbuscargasto #selemeses");
	getUltimateYears();
	seleanios.addEventListener("change", () => {
		if (seleanios.value == 0) {
			alertify.warning("Por favor, selecciona un año.");
			return;	
		} else getMonths(seleanios.value);	
	});
	selemeses.addEventListener("change", () => {
		if (selemeses.value == 0) {
			alertify.warning("Por favor, selecciona un mes.");
			return
		} else if (seleanios.value == 0) {
			alertify.warning("Por favor, selecciona un año.");
			return;
		} else getGastos(seleanios.value, selemeses.value);
	});
});
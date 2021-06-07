'use strict'
import handler from "./util/handler.js"
import util from "./util/util.js";
import { Categoria } from "./modules/categoria.js";

const displayCategorias = (categorias) => {
	const selecategorias = document.querySelector("#formguardargasto #selecategorias");
	util.componentCleaner(selecategorias);
	categorias.forEach( categoria => {
		let itemOpcion = document.createElement("option");
		itemOpcion.setAttribute('value', categoria.getId);
		itemOpcion.appendChild(document.createTextNode(categoria.getDsCategoria));
		selecategorias.appendChild(itemOpcion);
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
	then(Categoria.parseCategorias).
	then(displayCategorias).
	catch(handler.error);
}
const saveGasto = (event) => {
	document.querySelector("[form=formguardargasto]").disabled = true;
	const url = '/gasto';
	event.preventDefault();
	let idCategoria = parseInt(document.querySelector("#formguardargasto #selecategorias").value, 10);
	let monto = parseFloat(document.querySelector("#formguardargasto #nmromonto").value);
	let textdsgasto = document.querySelector("#formguardargasto #textdsgasto").value;
	let dsGasto = util.stringCleaner(new String(textdsgasto));
	try{
		if (dsGasto.length < 2 || dsGasto.length > 100) {
			alertify.warning("La descripci�n debe tener al menos 2 caracteres y menos de 100.");
			throw "La descripción debe tener al menos 2 caracteres y menos de 100.";
		}	
	} catch (e) {
		console.warn(e);
		document.querySelector("[form=formguardargasto]").disabled = false;
		return;
	}
	const payload = {
		'dsGasto' : dsGasto,
		'monto' : monto,
		'categoria' : {
			'id' : idCategoria 
		}
	}
	const request = {
		method : 'POST',
		body : JSON.stringify(payload),
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept' : 'application/json',
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseJson).
	then( gasto => {
		alertify.success("Se ha guardado con exito el gasto.");
		document.querySelector("#formguardargasto #nmromonto").value = "";
		document.querySelector("#formguardargasto #textdsgasto").value = "";
		document.querySelector("[form=formguardargasto]").disabled = false;
	}).
	catch(handler.error).
	catch( () => document.querySelector("[form=formguardargasto]").disabled = false);
}	

window.addEventListener("load", event => {
	getCategorias();
	const formguardargasto = document.getElementById('formguardargasto');
	formguardargasto.addEventListener("submit", saveGasto);
	const btoncategoria = document.getElementById('btoncategoria');
	btoncategoria.addEventListener("click", () => {
		window.location.replace('/home/categoriagasto');});
});
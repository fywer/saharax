'use strict'
import handler from "./util/handler.js"
import util from "./util/util.js";
import { Categoria } from "./modules/categoria.js";

if (sessionStorage.getItem("token") == null) {
	alertify.warning("El usuario no ha sido autentificado. Por favor, inicie sessión.");
	window.location.replace('/')
} else util.accessValidate();

const displaySetCategorias = (categorias) => {
	const selecategorias = document.querySelector("#selecategorias");
	categorias.forEach( categoria => {
		let itemOpcion = document.createElement("option");
		itemOpcion.setAttribute('value', categoria.getId);
		itemOpcion.appendChild(document.createTextNode(categoria.getDsCategoria));
		selecategorias.appendChild(itemOpcion);
	});
	$("#selecategorias").selectmenu("refresh");
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
	then(displaySetCategorias).
	catch(handler.error);
}
const saveGasto = (event) => {
	document.querySelector("[form=formguardargasto]").disabled = true;
	const url = '/gasto';
	event.preventDefault();
	let idCategoria = parseInt(document.getElementById('selecategorias').value, 10);
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
		document.getElementById('nmromonto').value = "";
		document.getElementById('textdsgasto').value = "";
		document.querySelector("[form=formguardargasto]").disabled = false;
	}).
	catch(handler.error).
	catch( () => document.querySelector("[form=formguardargasto]").disabled = false);
}	
window.addEventListener('load', (event) => {
	const formguardargasto = document.getElementById('formguardargasto');
	formguardargasto.addEventListener("submit", saveGasto);
	const btoninsertcategoria = document.getElementById('btoncategoria');
	btoninsertcategoria.addEventListener("click", () => {
		window.location.replace("/categoriagasto");
	});
	getCategorias();
	const btonhome = document.getElementById('btonhome');
	btonhome.addEventListener("click", () => {
		window.location.replace("/home");
	});
	const btonleergastos = document.getElementById('btonleergastos');
	btonleergastos.addEventListener("click", () => {
		window.location.replace("/gastos");
	});
});
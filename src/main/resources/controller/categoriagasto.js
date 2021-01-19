'use strict'
import handler from "./util/handler.js";
import util from "./util/util.js";
import { Categoria } from "./modules/categoria.js";

if (sessionStorage.getItem("token") == null) {
	alertify.warning("El usuario no ha sido autentificado. Por favor, inicie sessión.");
	window.location.replace('/')
} else util.accessValidate();

const createItemLink = (categoria) => {
	let itemLink = document.createElement("a");
	itemLink.setAttribute('id', categoria.getId);
	itemLink.appendChild( document.createTextNode(categoria.getDsCategoria) );
	itemLink.addEventListener("click", (event) => {
		alertify.confirm("¿Esta seguro de eliminar la categoría?",
		() => { deleteCategoria(categoria) },
		() => { return });
	});
	return itemLink;
}
const deleteCategoria = (categoria) => {
	const url = "/categoria".concat("/"+categoria.getId);
	const request = {
		method : 'DELETE',
		headers : {
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseText).
	then( () => {
		document.getElementById(categoria.getId).remove();
		alertify.success("Se ha eliminado la categoría con exito.");
	}).
	catch(handler.error);
}
const displayListCategoria = (categoria) => {
	const listcategorias = document.querySelector("#listcategorias");
	let itemList = document.createElement("li");
	let itemLink = createItemLink(categoria);
	itemList.appendChild(itemLink);
	listcategorias.appendChild(itemList);
	$("#listcategorias").listview('refresh');
	alertify.success("Se ha guardado con exito la categoría.");
	document.getElementById('textcategoria').value = "";
	document.querySelector("[form=formagregarcategoria]").disabled = false;
}		
const displayListCategorias = (categorias) => {
	const listcategorias = document.querySelector("#listcategorias");
	categorias.forEach( categoria => {
		let itemList = document.createElement("li");
		let itemLink = createItemLink(categoria);
		itemList.appendChild(itemLink);
		listcategorias.appendChild(itemList);
	});
	$("#listcategorias").listview('refresh');
}
const saveCategoria = (event) => {
	document.querySelector("[form=formagregarcategoria]").disabled = true;
	const url = '/categoria';
	event.preventDefault();
	let textcategoria = document.getElementById('textcategoria').value;
	let dsCategoria = util.stringCleaner(new String(textcategoria));
	try {
		if (dsCategoria.length < 2 || dsCategoria.length > 100) {
			alertify.warning("La categoría debe tener al menos 2 caracteres y menos de 100.");
			throw "La categoría debe tener al menos 2 caracteres y menos de 100.";
		}	
	} catch (e) {
		console.warn(e);
		document.querySelector("[form=formagregarcategoria]").disabled = false;
		return;
	}
	const payload = {
		'dsCategoria': dsCategoria
	}
	const request = {
		method : 'POST',	
		body: JSON.stringify(payload),
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept': 'application/json',
			'Authorization' : sessionStorage.getItem("token")
		}
	}			
	fetch(url, request).
	then(handler.responseJson).
	then(Categoria.parseCategoria).
	then(displayListCategoria).
	catch(handler.error).
	catch( () => document.querySelector("[form=formagregarcategoria]").disabled = false);
}
const getCategorias = () => {
	const url = '/categoria';
	const request = {
		method: 'GET',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseJson).
	then(Categoria.parseCategorias).
	then(displayListCategorias).
	catch(handler.error);
}
window.addEventListener("load", (event) => {
	const formagregarcategoria = document.getElementById('formagregarcategoria');
	formagregarcategoria.addEventListener("submit", saveCategoria);
	const btoncreargasto = document.getElementById('btoncreargasto');
	btoncreargasto.addEventListener("click", () => {
		window.location.replace('/creargasto');		
	});
	getCategorias();			
})
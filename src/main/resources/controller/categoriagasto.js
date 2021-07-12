'use strict'
import handler from "./util/handler.js";
import util from "./util/util.js";
import { Categoria } from "./modules/categoria.js";

const erase = async (url, request) => {
	const response = await fetch(url, request).
	then(handler.responseText).
	then( data => {
		console.warn(data);
		return new Promise( resolve => {
			resolve(data);
		});
	}).
	catch(handler.error);
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
	then(insertCategoria).
	catch(handler.error).
	catch( () => document.querySelector("[form=formagregarcategoria]").disabled = false);
}
const insertCategoria = (categoria) => {
	let itemOption = document.createElement("li");
	itemOption.setAttribute("id", categoria.getId);
	let itemLink = document.createElement("a");
	itemLink.addEventListener('click', (event) => {
		event.preventDefault();
		alertify.confirm('Borrar Categoría', "¿Esta seguro de eliminar la categoría?",
		() => {
			const url = "/categoria".concat("/"+categoria.getId);
			const request = {
				method : 'DELETE',
				headers : {
					'Authorization' : sessionStorage.getItem("token")
				}
			}
			const response = erase(url, request);
			console.log(typeof response);
			response.then( () => {
				document.getElementById(categoria.getId).remove();
				alertify.success("Se ha eliminado la categoría.");
			});		
		},
		() => {
			return
		}).set('labels', {ok: 'Eliminar', cancel: 'Cancelar'});
	});
	itemLink.appendChild(document.createTextNode(categoria.getDsCategoria) );
	const selecategorias = document.querySelector("#selecategorias");
	selecategorias.appendChild(itemOption);
	itemOption.appendChild(itemLink);
	alertify.success("Se ha guardado con exito la categoría.");
	document.getElementById('textcategoria').value = "";
	document.querySelector("[form=formagregarcategoria]").disabled = false;
}		
const displayCategorias = (categorias) => {
	const selecategorias = document.querySelector("#selecategorias");
	util.componentCleaner(selecategorias);
	categorias.forEach( categoria => {
		let itemOption = document.createElement("li");
		itemOption.setAttribute("id", categoria.getId);
		let itemLink = document.createElement("a");
		itemLink.addEventListener('click',  (event) => {
			event.preventDefault();
			alertify.confirm('Borrar Categoría', "¿Esta seguro de eliminar la categoría?",
			() => {
				const url = "/categoria".concat("/"+categoria.getId);
				const request = {
					method : 'DELETE',
					headers : {
						'Authorization' : sessionStorage.getItem("token")
					}
				}
				const response = erase(url, request);
				console.log(typeof response);
				response.then( () => {
					document.getElementById(categoria.getId).remove();
					alertify.success("Se ha eliminado la categoría.");
				});		
			},
			() => {
				return
			}).set('labels', {ok: 'Eliminar', cancel: 'Cancelar'});
		});
		 
		itemLink.appendChild(document.createTextNode(categoria.getDsCategoria) );
		itemOption.appendChild(itemLink);
		selecategorias.appendChild(itemOption);
	});
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
	then(displayCategorias).
	catch(handler.error);
}
window.addEventListener("load", event => {
	getCategorias();
	const formagregarcategoria = document.getElementById('formagregarcategoria');
	formagregarcategoria.addEventListener("submit", saveCategoria);
});
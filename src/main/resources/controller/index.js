'use strict'
import handler from "./util/handler.js"
import util from "./util/util.js"

const redirect = (data) => {
	if ( sessionStorage.getItem("token") == null) sessionStorage.setItem("token", data.token);
	window.location.replace('/home')
}	
const getUser = (event) => {
	document.querySelector("[form=formsignin]").disabled = true;
	const url = '/auth';
	event.preventDefault();
	let textuser = document.getElementById('textuser').value;
	let username = util.stringCleaner(new String(textuser));
	let textpass = document.getElementById("textpass").value;
	let password = util.stringCleaner(new String(textpass));
	try {
		if (username.length < 2 || username.length > 50) {
			alertify.warning("El usuario deber tener al menos 2 caracteres y menos de 50.");
			throw "El usuario deber tener al menos 2 caracteres y menos de 50.";
		}
		if (password.length < 5 || password.length > 100) {
			alertify.warning("La contraseña debe tener al menos 5 caracteres y menos de 100.");
			throw "La contraseña debe tener al menos 5 caracteres y menos de 100.";
		}	
	} catch(e) {
		console.warn(e);
		document.querySelector("[form=formsignin]").disabled = false;
		return;
	}
	const payload = {
		'username' : username,
		'password' : password
	}
	const request = {
		'method' : 'POST',
		'body' : JSON.stringify(payload),
		'headers' : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept' : 'application/json'
		}
	}
	fetch(url, request).
	then(handler.responseJson).
	then(redirect).
	catch(handler.error).
	catch( () => document.querySelector("[form=formsignin]").disabled = false );
}	
window.addEventListener("load", () => {
	const formsignin = document.getElementById("formsignin");
	formsignin.addEventListener("submit", getUser);
});
'use strict'
import util from "./util/util.js";

if (sessionStorage.getItem("token") == null) {
	alertify.warning("El usuario no ha sido autentificado. Por favor, inicie sessión.");
	window.location.replace('/')
} else util.accessValidate();

window.addEventListener("load", () => { 	
	const btonleergastos = document.getElementById("btonleergastos");
	btonleergastos.addEventListener('click', () => {
		window.location.replace('/gastos');
	});
	const btoncreargasto = document.getElementById("btoncreargasto");
	btoncreargasto.addEventListener('click', () => {
		window.location.replace("/creargasto");
	});
});
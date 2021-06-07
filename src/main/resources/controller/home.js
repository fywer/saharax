'use strict'
import util from "./util/util.js";

if (sessionStorage.getItem("token") == null) {
	alertify.warning("El usuario no ha sido autentificado. Por favor, inicie sessión.");
	window.location.replace('/')
} else util.accessValidate();

window.addEventListener('load', (event) => {
	setInterval( () => {
		let conectado = confirm("¿Desea seguir conectado?");
		if(conectado) console.log("La sesión se ha renovado.");
		else window.location.replace('/');
	}, 350000);
	
	const btoncreargasto = document.getElementById("creargasto");
	btoncreargasto.addEventListener("click", () => {
		window.location.replace('/home/creargasto');});
});
'use strict'
import util from "./util/util.js";

if (sessionStorage.getItem("token") == null) {
	alertify.warning("El usuario no ha sido autentificado. Por favor, inicie sessi�n.");
	window.location.replace('/')
} else util.accessValidate();
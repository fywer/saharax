const error = (e) => {
	console.error(e);
	alertify.error('Por favor, intentalo mas tarde.' + e);
	return new Promise( (resolve, reject) => {
		reject();
	});
}
const errorSession = (e) => {
	console.error(e);
	alertify.warning(e);
	window.location.replace('/');
}
const responseText = (response) => {
	console.warn(response);
	if (response.status == 400) {
		return new Promise( (resolve, reject) => {
			reject("No se ha encontrado el recurso solicitado.");
		});
	} 
	else if (response.status == 401) {
		sessionStorage.removeItem('token');
		return new Promise( (resolve, reject) => {
			reject("La session del usuario ha sido expidada. Por favor, inicie sessión.");
		});
	}
	else if (response.status == 429) {
		return new Promise( (resolve, reject) => {
			reject("Se han enviado demasiadas peticiones en un tiempo deteminado.");
		});
	}
	else if (response.status == 500) {
		return new Promise( (resolve, reject) => {
			reject();
		});
	} 
	return response.text();
}
const responseJson = (response) => {
	console.warn(response);
	if (response.status == 400) {
		return new Promise( (resolve, reject) => {
			reject("No se ha encontrado el recurso solicitado.");
		}); 
	}
	else if (response.status == 401) {
		return new Promise( (resolve, reject) => {
			reject("El usuario no ha sido autorizado.");
		});
	} else if (response.status == 429) {
		return new Promise( (resolve, reject) => {
			reject("Se han enviado demasiadas peticiones en un tiempo deteminado.");
		});
	} else if (response.status == 500) {
		return new Promise( (resolve, reject) => {
			reject();
		});
	}
	return response.json();
}
export default {
	'error' : error,
	'errorSession' : errorSession,
	'responseText' : responseText,
	'responseJson' : responseJson
}
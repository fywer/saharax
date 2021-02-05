import handler from "./handler.js";
const stringCleaner = (cadena) => {
	let cadenaClean = new String();
	let temp = cadena.trim().split(" ");
	temp.forEach( item => {
		if (item.length > 0) cadenaClean = cadenaClean.concat(item + " ");
	});
	return cadenaClean.trim();
}
const accessValidate = () => {
	const url = '/online';
	const request = {
		method : 'GET',
		headers : {
			'Authorization' : sessionStorage.getItem("token")
		}
	}
	fetch(url, request).
	then(handler.responseText).
	catch(handler.errorSession);
}
const mesFormat = (mes) => {
	switch (mes) {
		case 1:
			return "Enero";
		case 2:
			return "Febrero";
		case 3:
			return "Marzo";
		case 4:
			return "Abril";
		case 5:
			return "Mayo";
		case 6:
			return "Junio";
		case 7:
			return "Julio";
		case 8:
			return "Agosto";
		case 9:
			return "Septiembre";
		case 10:
			return "Octubre";
		case 11:
			return "Noviembre";
		case 12:
			return "Diciembre";
		default:
			return "No valida";
	}
}	
const componentCleaner = (component) => {
	while (component.firstChild){
 		component.removeChild(component.firstChild);
	};
}
export default {
	'stringCleaner' : stringCleaner,
	'accessValidate' : accessValidate,
	'mesFormat' : mesFormat,
	'componentCleaner' : componentCleaner
}	
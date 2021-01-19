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

export default {
	'stringCleaner' : stringCleaner,
	'accessValidate' : accessValidate
}
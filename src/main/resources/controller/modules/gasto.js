import { Categoria } from "./categoria.js";
class Gasto {
	constructor(id, dsGasto, monto, dia, mes, anio, diasemana, ultimaActualizacion, categoria) {
		this.id = id;
		this.dsGasto = dsGasto;
		this.monto = monto;
		this.dia = dia;
		this.mes = mes;
		this.anio = anio;
		this.diasemana = diasemana;
		this.ultimaActualizacion = ultimaActualizacion,
		this.categoria = categoria;
	}
	parser(data) {
		let ultimaActualizacion = new Date(data.ultimaActualizacion);
		this.id = data.id;
		this.dsGasto = data.dsGasto;
		this.monto = data.monto;
		this.dia = ultimaActualizacion.getDate();
		this.mes = ultimaActualizacion.getMonth();
		this.anio = ultimaActualizacion.getFullYear();
		this.diasemana = ultimaActualizacion.getDay();
		this.ultimaActualizacion = new Intl.DateTimeFormat('fr-ca').format(ultimaActualizacion).replace("/", "-").replace("/", "-"),
		this.categoria = new Categoria(data.categoria.id, data.categoria.dsCategoria)
		return this;
	}	
	get getId() {
		return this.id;
	}
	get getDsGasto() {
		return this.dsGasto;
	}
	get getCategoria() {
		return this.categoria;
	}
	get getDia() {
		return this.dia;
	}
	get getMonto() {
		return this.monto;
	}
	get getMes() {
		return this.mes;
	}
	get getAnio() {
		return this.anio;
	}	
	get getUltimaActualizacion() {
		return this.ultimaActualizacion
	}
	get getMontoFomat() {
		let montoformat = this.monto.toFixed(2);
		return  "$" + montoformat;
	}
	get getMesFormat() {
		switch (this.mes) {
			case 0:
				return "Enero";
			case 1:
				return "Febrero";
			case 2:
				return "Marzo";
			case 3:
				return "Abril";
			case 4:
				return "Mayo";
			case 5:
				return "Junio";
			case 6:
				return "Julio";
			case 7:
				return "Agosto";
			case 8:
				return  "Septiembre";
			case 9:
				return "Octubre";
			case 10:
				return "Noviembre";
			case 11:
				return "Diciembre";
		}
	} 
	get getDiaSemanaFormat() {
		switch(this.diasemana) {
			case 0:
				return "Domingo";
			case 1:
				return "Lunes";
			case 2:
				return "Martes";
			case 3:
				return "Miércoles";
			case 4:
				return "Jueves";
			case 5:
				return "Viernes";
			case 6:
				return "Sábado";
		}
	}  
	
	static parseGasto(data) {
		let ultimaActualizacion = new Date(data.ultimaActualizacion);
		let id = data.id;
		let dsGasto = data.dsGasto;
		let monto = data.monto;
		let dia = ultimaActualizacion.getDate();
		let mes = ultimaActualizacion.getMonth();
		let anio = ultimaActualizacion.getFullYear();
		let diasemana = ultimaActualizacion.getDay();
		let categoria = data.categoria
		let gasto = new Gasto(
			id,
			dsGasto,
			monto,
			dia,
			mes,
			anio,
			diasemana,
			new Intl.DateTimeFormat('fr-ca').format(ultimaActualizacion).replace("/", "-").replace("/", "-"),
			new Categoria(categoria.id, categoria.dsCategoria)
		);
		return new Promise( (resolve, reject) => {
			resolve(gasto);
		});
	}
	
	static parseGastos(data) {
		let gastos = []
		data.forEach( item => {
			let gasto = new Gasto().parser(item);
			gastos.push(gasto);
		});
		return new Promise( (resolve, reject) => {
			resolve(gastos);
		});		
	}
	static agruparGastosPorDia(data) {
		let gastospordia = [];
		for(let i = 31; i > 0; i --) {
			gastospordia.push(data.filter( gasto => gasto.getDia == i));
		}
		localStorage.setItem('gastos', JSON.stringify(gastospordia));
		return new Promise( resolve => {
			resolve(gastospordia);
		});
	}
}
export { Gasto }
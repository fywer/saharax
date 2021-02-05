class Categoria {
	constructor(id, dsCategoria) {
		this.id = id;
		this.dsCategoria = dsCategoria;
	}
	get getId() {
		return this.id;
	}
	get getDsCategoria() {
		return this.dsCategoria;
	}
	static parseCategorias(data) {
		let categorias = [];
		data.forEach( item => {
			let id = item.id;
			let dsCategoria = item.dsCategoria;
			let categoria = new Categoria(id, dsCategoria);
			categorias.push(categoria);
		});
		return new Promise( (resolve, reject) => {
			resolve(categorias);
		});
	}
	static parseCategoria(data) {
		let id = data.id;
		let dsCategoria = data.dsCategoria;
		let categoria = new Categoria(id, dsCategoria);
		return new Promise( (resolve, reject) => {
			resolve(categoria);
		});
	}
}
export { Categoria }
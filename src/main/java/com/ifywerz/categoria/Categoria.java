package com.ifywerz.categoria;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "DS_CATEGORIA", length = 100, unique = true)
    @NotNull
    @Size(min = 2, max= 100)
    private String dsCategoria;	

    public Categoria() {
		// TODO Auto-generated constructor stub
	}
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public String getDsCategoria() {
		return dsCategoria;
	}

	public void setDsCategoria(String dsCategoria) {
		this.dsCategoria = dsCategoria;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((dsCategoria == null) ? 0 : dsCategoria.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Categoria other = (Categoria) obj;
		if (dsCategoria == null) {
			if (other.dsCategoria != null)
				return false;
		} else if (!dsCategoria.equals(other.dsCategoria))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Categoria [id=" + id + ", dsCategoria=" + dsCategoria + "]";
	}
}

package com.ifywerz.gasto;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import com.ifywerz.categoria.Categoria;


@Entity
public class Gasto {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "DS_GASTO", length = 100)
    @NotNull
    @Size(min = 2, max = 100)
    private String dsGasto;
    
    @Column(name = "MONTO")
    @NotNull
    private Double monto;
    
    @Column(name = "ULTIMA_ACTUALIZACION", columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Calendar ultimaActualizacion;

    @OneToOne
    @JoinColumn(name = "CATEGORIA_ID", referencedColumnName = "ID")
    @NotNull
    private Categoria categoria;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDsGasto() {
		return dsGasto;
	}

	public void setDsGasto(String dsGasto) {
		this.dsGasto = dsGasto;
	}

	public Double getMonto() {
		return monto;
	}

	public void setMonto(Double monto) {
		this.monto = monto;
	}

	public Calendar getUltimaActualizacion() {
		return ultimaActualizacion;
	}

	public void setUltimaActualizacion(Calendar ultimaActualizacion) {
		this.ultimaActualizacion = ultimaActualizacion;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((categoria == null) ? 0 : categoria.hashCode());
		result = prime * result + ((dsGasto == null) ? 0 : dsGasto.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((monto == null) ? 0 : monto.hashCode());
		result = prime * result + ((ultimaActualizacion == null) ? 0 : ultimaActualizacion.hashCode());
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
		Gasto other = (Gasto) obj;
		if (categoria == null) {
			if (other.categoria != null)
				return false;
		} else if (!categoria.equals(other.categoria))
			return false;
		if (dsGasto == null) {
			if (other.dsGasto != null)
				return false;
		} else if (!dsGasto.equals(other.dsGasto))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (monto == null) {
			if (other.monto != null)
				return false;
		} else if (!monto.equals(other.monto))
			return false;
		if (ultimaActualizacion == null) {
			if (other.ultimaActualizacion != null)
				return false;
		} else if (!ultimaActualizacion.equals(other.ultimaActualizacion))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Gasto [id=" + id + ", dsGasto=" + dsGasto + ", monto=" + monto + ", ultimaActualizacion="
				+ ultimaActualizacion + ", categoria=" + categoria + "]";
	}
	
}

package com.ifywerz.gasto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GastoRepository extends JpaRepository<Gasto, Long> {
    //User findByUsername(String username);
	@Query("FROM Gasto ORDER BY ultimaActualizacion ASC")
	List<Gasto> findAllOrderByDate(); 
	
	@Query("FROM Gasto WHERE YEAR(ultimaActualizacion) = ?1 AND MONTH(ultimaActualizacion) = ?2 ORDER BY ultimaActualizacion DESC")
	List<Gasto> findAllByYearAndMonth(int year, int month);
	
	@Query("SELECT DISTINCT YEAR(ultimaActualizacion) FROM Gasto ORDER BY YEAR(ultimaActualizacion) ASC")
	List<Object> findUltimateYears();
	
	@Query("SELECT DISTINCT MONTH(ultimaActualizacion) FROM Gasto WHERE YEAR(ultimaActualizacion) = ?1")
	List<Object> findMonths(int year);
}

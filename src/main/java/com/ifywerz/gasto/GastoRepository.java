package com.ifywerz.gasto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GastoRepository extends JpaRepository<Gasto, Long> {
    //User findByUsername(String username);
	@Query("FROM Gasto ORDER BY ultimaActualizacion ASC")
	List<Gasto> findAllOrderByDate(); 
}

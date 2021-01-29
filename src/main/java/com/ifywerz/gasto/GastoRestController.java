package com.ifywerz.gasto;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/gasto")
public class GastoRestController {

    @Autowired
    private GastoRepository gastoRepository;

    @RequestMapping(method = RequestMethod.GET)
    public List<Gasto> findAll() {
    	return gastoRepository.findAllOrderByDate();
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/year/{anio}")
    public List<Gasto> findAllByYearAndMonth(@PathVariable int anio,  @RequestParam("mes") int mes) {
		return gastoRepository.findAllByYearAndMonth(anio, mes);
    }
    
	@RequestMapping(method = RequestMethod.GET, value = "/{gastoId}")
    public Gasto findOne(@PathVariable Long gastoId) {
        return gastoRepository.findOne(gastoId);
    }
    
	@RequestMapping(method = RequestMethod.POST)
    public Gasto add(@RequestBody Gasto gasto) {
        return gastoRepository.save(gasto);
    }

	@RequestMapping(method = RequestMethod.PUT)
    public Gasto update(@RequestBody Gasto gasto) {
		gasto.getUltimaActualizacion().add(Calendar.DAY_OF_MONTH, 1);
        return gastoRepository.save(gasto);
    }
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{gastoId}")
    public void delete(@PathVariable Long gastoId) {
        gastoRepository.delete(gastoId);
    }
	
}


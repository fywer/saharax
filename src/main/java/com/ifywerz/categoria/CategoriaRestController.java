package com.ifywerz.categoria;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/categoria")
public class CategoriaRestController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @RequestMapping(method = RequestMethod.GET)
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }
    
	@RequestMapping(method = RequestMethod.GET, value = "/{categoriaId}")
    public Categoria findOne(@PathVariable Long categoriaId) {
        return categoriaRepository.findOne(categoriaId);
    }
    
	@RequestMapping(method = RequestMethod.POST)
    public Categoria add(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

	@RequestMapping(method = RequestMethod.PUT)
    public Categoria update(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{categoriaId}")
    public void delete(@PathVariable Long categoriaId) {
        categoriaRepository.delete(categoriaId);
    }
	
}


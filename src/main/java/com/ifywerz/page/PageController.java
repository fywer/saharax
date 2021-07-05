	package com.ifywerz.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping("/")
public class PageController {

	public static final String HOME = "home";
	public static final String CREAR_GASTO = HOME+"/creargasto";
	public static final String CATEGORIA_GASTO = HOME+"/categoriagasto";
	public static final String LEER_GASTOS = HOME+"/gastos";
	
	public PageController() {
		// TODO Auto-generated constructor stub
	}
	
    @GetMapping
	public ModelAndView login() {
		return new ModelAndView("index");
	}
    
    @GetMapping(HOME)
	public ModelAndView home() {
		return new ModelAndView("home");
	}
    
    @GetMapping(CREAR_GASTO)
    public ModelAndView crearGasto() {
    	return new ModelAndView("pages/creargasto");
    }
    
    @GetMapping(CATEGORIA_GASTO)
    public ModelAndView categoriaGasto() {
    	return new ModelAndView("pages/categoriagasto");
    }
    
    @GetMapping(LEER_GASTOS)
    public ModelAndView leerGastos() {
    	return new ModelAndView("pages/leergastos");
    }
}
package com.ifywerz.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping("/")
public class PageController {

	public static final String HOME = "home";
	public static final String LEER_GASTOS = "gastos";
	public static final String CREAR_GASTO = "creargasto";
	public static final String CATEGORIA_GASTO = "categoriagasto";
	public static final String CONFIGURACION = "configuracion";

	public PageController() {
		// TODO Auto-generated constructor stub
	}
	
    @GetMapping
	public ModelAndView login() {
		return new ModelAndView("index")
				.addObject("title", "Sign in")
				.addObject("page", "login");

	}
    
    @GetMapping(HOME)
	public ModelAndView home() {
		return new ModelAndView("home")
				.addObject("title", "Home")
				.addObject("page", "main");
	}
    
    @GetMapping(LEER_GASTOS)
	public ModelAndView gastos() {
    	return new ModelAndView("leergastos")
    			.addObject("title", "Gastos")
    			.addObject("page", "page");
    }

	@GetMapping(CREAR_GASTO)
	public ModelAndView creargasto() {
    	return new ModelAndView("creargasto")
    			.addObject("title", "Crear Gastos")
    			.addObject("page", "page");
    }
	
	@GetMapping(CATEGORIA_GASTO)
	public ModelAndView categoriagasto() {
		return new ModelAndView("categoriagasto")
				.addObject("title", "Categoría Gasto")
				.addObject("page", "subpage");
	}
	
	@GetMapping(CONFIGURACION)
	public String configuracion() {
		return "configuracion";
	}
}


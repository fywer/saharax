package com.ifywerz.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping("/")
public class PageController {

	public static final String HOME = "home";

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
}


package com.sms.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;

import com.sms.vo.ErrorJson;

@RestController
public class AppErrorController implements ErrorController {

	private static final String  PATH = "/error";
	
    @Autowired
    private ErrorAttributes errorAttributes;
	
	@RequestMapping(value = PATH, method=RequestMethod.GET)
    public ErrorJson error(HttpServletRequest request, HttpServletResponse response) {
        // Appropriate HTTP response code (e.g. 404 or 500) is automatically set by Spring. 
        // Here we just define response body.
		ServletWebRequest servletWebRequest = new ServletWebRequest(request);
		Map<String, Object> attributes = errorAttributes.getErrorAttributes(servletWebRequest, false);
        return new ErrorJson(response.getStatus(), attributes);
    }
	
	@Override
	public String getErrorPath() {
		return PATH;
	}
}

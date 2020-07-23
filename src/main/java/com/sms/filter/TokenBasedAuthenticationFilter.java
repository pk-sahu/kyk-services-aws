package com.sms.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class TokenBasedAuthenticationFilter extends UsernamePasswordAuthenticationFilter{

	public TokenBasedAuthenticationFilter( AuthenticationManager authenticationManager){
		setAuthenticationManager(authenticationManager);
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		//super.successfulAuthentication(request, response, chain, authResult);
		response.addHeader(HttpHeaders.AUTHORIZATION, "succecss!");
	}
}

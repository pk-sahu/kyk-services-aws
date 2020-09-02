package com.sms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sms.vo.JwtRequest;
import com.sms.vo.JwtResponse;
import com.sms.dao.UserDaoAWS;
import com.sms.model.UserInfoAWS;
import com.sms.service.UserDetailsServiceImpl;
import com.sms.util.JwtTokenUtil;

@RestController
@CrossOrigin(origins="${client.url}")
@RequestMapping("/kyk")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private UserDetailsServiceImpl userDetailsService;
	
	@Autowired
	private UserDaoAWS userRepository;

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {

		authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

		final UserDetails userDetails = userDetailsService
				.loadUserByUsername(authenticationRequest.getUsername());

		String token = jwtTokenUtil.generateToken(userDetails);
		
		UserInfoAWS userInfo = userRepository.getActiveUser(authenticationRequest.getUsername());

		if("false".equalsIgnoreCase(userInfo.getUserstatus())) {
			token = userInfo.getUserstatus();
		}

		return ResponseEntity.ok(new JwtResponse(token));
	}

	private void authenticate(String username, String password) throws Exception {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new Exception("USER_DISABLED", e);
		} catch (BadCredentialsException e) {
			throw new Exception("INVALID_CREDENTIALS", e);
		}
	}	
}

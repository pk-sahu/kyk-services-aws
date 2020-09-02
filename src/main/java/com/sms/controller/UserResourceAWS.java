package com.sms.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sms.model.UserInfoAWS;
import com.sms.service.UserServiceAWS;
import com.sms.util.PasswordEncoderUtil;

@CrossOrigin(origins="${client.url}")
@RestController
public class UserResourceAWS {

	@Autowired
	private UserServiceAWS userService;
	
	@GetMapping("/kyk/users/detail/{username}")
	public UserInfoAWS getUserDetail(@PathVariable String username){
		return userService.getUserDetail(username);
	}
	@GetMapping("/kyk/users/fullusername/{username}")
	public String getFullUsername(@PathVariable String username){
		return userService.getFullUsername(username);
	}	
	@GetMapping("/kyk/users/getallusers")
	public List<UserInfoAWS> getAllUsers(){
		return userService.getAllUsers();
	}
	@GetMapping("/kyk/users/getuserbyid/{id}")
	public UserInfoAWS getUserById(@PathVariable String id){
		return userService.getUserById(id);
	}
	@DeleteMapping("/kyk/users/deleteuser/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable String id){		
		userService.deleteUser(id);		
		return ResponseEntity.noContent().build();
	}
	@PutMapping("/kyk/users/updateuser")
	public ResponseEntity<UserInfoAWS> updateUser(@RequestBody UserInfoAWS user){
		
		String encodedPassword = PasswordEncoderUtil.encodedPassword(user.getPlainpassword());
		user.setPassword(encodedPassword);
		userService.updateUser(user);
		return new ResponseEntity<UserInfoAWS>(user, HttpStatus.OK);
	}
	@PostMapping("/kyk/users/createuser")
	public ResponseEntity<Void> createUser(@RequestBody UserInfoAWS user){
		
		String encodedPassword = PasswordEncoderUtil.encodedPassword(user.getPlainpassword());
		user.setPassword(encodedPassword);
		userService.addUser(user);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(user.getId(),toString()).toUri();
		
		return ResponseEntity.created(uri).build();
	}
}

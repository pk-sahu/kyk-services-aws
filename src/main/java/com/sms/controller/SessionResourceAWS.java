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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sms.model.SessionAWS;
import com.sms.service.SessionServiceAWS;

@CrossOrigin(origins="${client.url}")
@RestController
public class SessionResourceAWS {
 
	@Autowired
	private SessionServiceAWS sessionServiceAWS;
	
	@GetMapping("/kyk/sessions")
	public List<SessionAWS> getAllSessions(){
		return sessionServiceAWS.getAllSessions();
	}
	@GetMapping("/kyk/sessions/{id}")
	public SessionAWS getSession(@PathVariable String id){
		return sessionServiceAWS.getSessionById(id);
	}
	@GetMapping("/kyk/sessions/foruser/{username}")
	public List<SessionAWS> getSessionForUser(@PathVariable String username){
		return sessionServiceAWS.getSessionForUser(username);
	}
	@DeleteMapping("/kyk/sessions/{id}")
	public ResponseEntity<Void> deleteSession(@PathVariable String id){		
		sessionServiceAWS.deleteSession(id);		
		return ResponseEntity.noContent().build();
	}
	@PutMapping("/kyk/sessions/{id}")
	public ResponseEntity<SessionAWS> updateSession(@PathVariable long id, 
											     @RequestBody SessionAWS session){
		sessionServiceAWS.updateSession(session);
		return new ResponseEntity<SessionAWS>(session, HttpStatus.OK);
	}
	@PostMapping("/kyk/sessions")
	public ResponseEntity<Void> createSession(@RequestBody SessionAWS session){
		
		sessionServiceAWS.addSession(session);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(session.getId()).toUri();
		
		return ResponseEntity.created(uri).build();
	}
	@PostMapping("/kyk/uploadSession")
	public ResponseEntity<String> uploadSession(@RequestPart(value = "file") MultipartFile file){
		System.out.println(".....uploadSession.....");
		String fileName = sessionServiceAWS.uploadSession(file);
		return new ResponseEntity<String>(fileName, HttpStatus.OK);
	}
}

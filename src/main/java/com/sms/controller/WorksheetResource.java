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
import com.sms.model.WorksheetAWS;
import com.sms.service.WorksheetService;

@CrossOrigin(origins="${client.url}")
@RestController
public class WorksheetResource {

	@Autowired
	private WorksheetService worksheetService;
	
	@GetMapping("/kyk/worksheets")
	public List<WorksheetAWS> getAllWorksheets(){
		return worksheetService.getAllWorksheets();
	}
	@GetMapping("/kyk/worksheets/{id}")
	public WorksheetAWS getWorksheet(@PathVariable String id){
		return worksheetService.getWorksheetById(id);
	}
	@GetMapping("/kyk/worksheets/foruser/{username}")
	public List<WorksheetAWS> getWorksheetForUser(@PathVariable String username){
		return worksheetService.getWorksheetForUser(username);
	}
	@DeleteMapping("/kyk/worksheets/{id}")
	public ResponseEntity<Void> deleteWorksheet(@PathVariable String id){		
		worksheetService.deleteWorksheet(id);		
		return ResponseEntity.noContent().build();
	}
	@PutMapping("/kyk/worksheets/{id}")
	public ResponseEntity<WorksheetAWS> updateWorksheet(@PathVariable long id, 
											     @RequestBody WorksheetAWS worksheetAWS){
		worksheetService.updateWorksheet(worksheetAWS);
		return new ResponseEntity<WorksheetAWS>(worksheetAWS, HttpStatus.OK);
	}
	@PostMapping("/kyk/worksheets")
	public ResponseEntity<Void> createWorksheet(@RequestBody WorksheetAWS worksheetAWS){
		
		worksheetService.addWorksheet(worksheetAWS);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(worksheetAWS.getId()).toUri();
		
		return ResponseEntity.created(uri).build();
	}
	@PostMapping(value="/kyk/uploadWorksheet")
	public ResponseEntity<String> uploadWorksheet(@RequestPart(value = "file") MultipartFile file){
		String fileName = worksheetService.uploadWorksheet(file);
		return new ResponseEntity<String>(fileName, HttpStatus.OK);
	}
}

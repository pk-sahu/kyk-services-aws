package com.sms.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import com.sms.model.PhotoAWS;
import com.sms.service.PhotoServiceAWS;

@CrossOrigin(origins="${client.url}")
@RestController
public class PhotoResourceAWS {

	@Autowired
	private PhotoServiceAWS photoServiceAWS;
	
	@GetMapping("/kyk/photos")
	public List<PhotoAWS> getAllPhotos(){
		return photoServiceAWS.getAllPhotos();
	}
	@GetMapping("/kyk/photos/{id}")
	public PhotoAWS getPhoto(@PathVariable String id){
		return photoServiceAWS.getPhotoById(id);
	}
	@DeleteMapping("/kyk/photos/{id}")
	public ResponseEntity<Void> deletePhoto(@PathVariable String id){		
		photoServiceAWS.deletePhoto(id);		
		return ResponseEntity.noContent().build();
	}
	@PutMapping("/kyk/photos/{id}")
	public ResponseEntity<PhotoAWS> updatePhoto(@PathVariable long id, 
											     @RequestBody PhotoAWS photoAWS){
		photoServiceAWS.updatePhoto(photoAWS);
		return new ResponseEntity<PhotoAWS>(photoAWS, HttpStatus.OK);
	}
	@PostMapping("/kyk/photos")
	public ResponseEntity<Void> createPhoto(@RequestBody PhotoAWS photoAWS){
		
		photoServiceAWS.addPhoto(photoAWS);
		
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(photoAWS.getId()).toUri();
		
		return ResponseEntity.created(uri).build();
	}
	@PostMapping(value="/kyk/uploadPhoto")
	public ResponseEntity<String> uploadPhoto(@RequestPart(value = "file") MultipartFile file){
		String fileName = photoServiceAWS.uploadPhoto(file);
		return new ResponseEntity<String>(fileName, HttpStatus.OK);
	}
}

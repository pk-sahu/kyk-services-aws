package com.sms.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.sms.dao.SessionDaoAWS;
import com.sms.model.SessionAWS;
import com.sms.util.VisibleDateComparator;

@Service
public class SessionServiceAWS {

	@Autowired
	private SessionDaoAWS sessionDaoAWS;
	
	@Autowired
	private AmazonS3 amazonS3;
	
	@Value("${amazonProperties.endpointUrl}")
	private String endpointUrl;
	
	@Value("${amazonProperties.bucketName}")
	private String bucketName;
	
	public SessionAWS getSessionById(String id){
		SessionAWS sessionAWS = sessionDaoAWS.findById(id);
		return sessionAWS;
	}
	
	public List<SessionAWS> getAllSessions() {
		List<SessionAWS> sessionArrayList = sessionDaoAWS.findAll();
		Collections.sort(sessionArrayList,new VisibleDateComparator());
		return sessionArrayList;	
	}
	
	public List<SessionAWS> getSessionForUser(String username) {
		List<SessionAWS> sessionArrayList = sessionDaoAWS.getSessionForUser(username);
		Collections.sort(sessionArrayList,new VisibleDateComparator());
		return sessionArrayList;	
	}
	
	public void addSession(SessionAWS session){
		sessionDaoAWS.save(session);
	}
	
	public SessionAWS updateSession(SessionAWS session){
		if( !"".equals(session.getFileName())) {
			SessionAWS fetchedSession = getSessionById(session.getId());
			if(!session.getFileName().equals(fetchedSession.getFileName()))
				deleteFileFromBucket(fetchedSession.getFileName());
		}
		SessionAWS updatedSession = sessionDaoAWS.update(session);
		return updatedSession;
	}
	
	public void deleteSession(String id){
		SessionAWS Session = getSessionById(id);
		sessionDaoAWS.deleteById(id);
		deleteFileFromBucket(Session.getFileName());
	}

	public String uploadSession(MultipartFile multiPart) {
		String fileUrl = "";
		try {
			File file = convertMultiPartToFile(multiPart);
			String fileName = new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
			fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
			amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file));
			file.delete();
		} catch (AmazonServiceException ase) {
	        System.out.println("Error Message:    " + ase.getMessage());
        } catch (AmazonClientException ace) {
        	System.out.println("Error Message:    " + ace.getMessage());
        } catch (IOException ioe) {
        	System.out.println("Error Message:    " + ioe.getMessage());
        } catch (Exception e) {
        	System.out.println("Error Message:    " + e.getMessage());
		}
		return fileUrl;
	}
	
	private String deleteFileFromBucket(String fileUrl) {
		String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
		boolean exist = amazonS3.doesObjectExist(bucketName, fileName);
		if(!exist) {
			return "file not found!!";
		}
		amazonS3.deleteObject(bucketName, fileName);
		return "Successfully deleted";
	}
	
	private File convertMultiPartToFile(MultipartFile file) throws IOException {
		File convFile = new File(file.getOriginalFilename());
		FileOutputStream fos = new FileOutputStream(convFile);
		fos.write(file.getBytes());
		fos.close();
		return convFile;
	}
	
	
}

package com.sms.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collections;
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
import com.sms.dao.WorksheetDao;
import com.sms.model.SessionAWS;
import com.sms.model.WorksheetAWS;
import com.sms.util.VisibleDateComparator;
import com.sms.util.WorksheetDateComparator;

@Service
public class WorksheetService {

	@Autowired
	private WorksheetDao worksheetDao;
	
	@Autowired
	private AmazonS3 amazonS3;
	
	@Value("${amazonProperties.endpointUrl}")
	private String endpointUrl;
	
	@Value("${amazonProperties.bucketName}")
	private String bucketName;
	
	public WorksheetAWS getWorksheetById(String id){
		WorksheetAWS worksheetAWS = worksheetDao.findById(id);
		return worksheetAWS;
	}
	
	public List<WorksheetAWS> getAllWorksheets() {
		List<WorksheetAWS> worksheetArrayList = worksheetDao.findAll();
		Collections.sort(worksheetArrayList,new WorksheetDateComparator());
		return worksheetArrayList;	
	}
	
	public List<WorksheetAWS> getWorksheetForUser(String username) {
		List<WorksheetAWS> sessionArrayList = worksheetDao.getWorksheetForUser(username);
		Collections.sort(sessionArrayList,new WorksheetDateComparator());
		return sessionArrayList;	
	}
	
	public void addWorksheet(WorksheetAWS worksheetAWS){
		worksheetDao.save(worksheetAWS);
	}
	
	public WorksheetAWS updateWorksheet(WorksheetAWS worksheetAWS){
		if( !"".equals(worksheetAWS.getFileName())) {
			WorksheetAWS fetchedWorksheet = getWorksheetById(worksheetAWS.getId());
			if(!worksheetAWS.getFileName().equals(fetchedWorksheet.getFileName()))
				deleteFileFromBucket(fetchedWorksheet.getFileName());
		}
		WorksheetAWS updatedWorksheet = worksheetDao.update(worksheetAWS);
		return updatedWorksheet;
	}
	
	public void deleteWorksheet(String id){
		WorksheetAWS worksheetAWS = getWorksheetById(id);
		worksheetDao.deleteById(id);
		deleteFileFromBucket(worksheetAWS.getFileName());
	}

	public String uploadWorksheet(MultipartFile multiPart) {
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

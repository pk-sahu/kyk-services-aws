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
import com.sms.model.PhotoAWS;
import com.sms.util.AlbumDateComparator;

@Service
public class PhotoServiceAWS {

	@Autowired
	private com.sms.dao.PhotoDaoAWS photoDaoAWS;
	
	@Autowired
	private AmazonS3 amazonS3;
	
	@Value("${amazonProperties.endpointUrl}")
	private String endpointUrl;
	
	@Value("${amazonProperties.bucketName}")
	private String bucketName;
	
	public PhotoAWS getPhotoById(String id){
		PhotoAWS photoAWS = photoDaoAWS.findById(id);
		return photoAWS;
	}
	
	public List<PhotoAWS> getAllPhotos() {
		List<PhotoAWS> photoArrayList = photoDaoAWS.findAll();
		Collections.sort(photoArrayList,new AlbumDateComparator());
		return photoArrayList;	
	}
	
	public void addPhoto(PhotoAWS photoAWS){
		photoDaoAWS.save(photoAWS);
	}
	
	public PhotoAWS updatePhoto(PhotoAWS photoAWS){
		if( !"".equals(photoAWS.getFileName())) {
			PhotoAWS fetchedPhoto = getPhotoById(photoAWS.getId());
			if(!photoAWS.getFileName().equals(fetchedPhoto.getFileName()))
				deleteFileFromBucket(fetchedPhoto.getFileName());
		}
		PhotoAWS updatedPhoto = photoDaoAWS.update(photoAWS);
		return updatedPhoto;
	}
	
	public void deletePhoto(String id){
		PhotoAWS photoAWS = getPhotoById(id);
		photoDaoAWS.deleteById(id);
		deleteFileFromBucket(photoAWS.getFileName());
	}

	public String uploadPhoto(MultipartFile multiPart) {
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

package com.sms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sms.dao.UserDaoAWS;
import com.sms.model.UserInfoAWS;

@Service
public class UserServiceAWS {

	@Autowired
	private UserDaoAWS userRepository;
	
	public UserInfoAWS getUserById(String id){
		UserInfoAWS user = userRepository.findById(id);
		return user;
	}
	
	public List<UserInfoAWS> getAllUsers() {
		List<UserInfoAWS> userArrayList = userRepository.findAll();
		return userArrayList;	
	}
	
	public void addUser(UserInfoAWS user){
		userRepository.save(user);
	}
	
	public UserInfoAWS updateUser(UserInfoAWS user){
		userRepository.update(user);
		return user;
	}
	
	public void deleteUser(String id){
		userRepository.deleteById(id);
	}

	public String getUserDetail(String username) {
		UserInfoAWS userInfo = userRepository.getActiveUser(username);
		return userInfo.getRole();
	}
	
	public String getFullUsername(String username) {
		UserInfoAWS userInfo = userRepository.getActiveUser(username);
		return userInfo.getStudentname();
	}
}

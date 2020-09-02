package com.sms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.sms.filter.JwtRequestFilter;
import com.sms.service.UserDetailsServiceImpl;

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled=true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsServiceImpl userDetailsServiceImpl;	
	
	@Autowired
	private AppAuthenticationEntryPoint appAuthenticationEntryPoint;
	
	@Autowired
	private JwtRequestFilter jwtRequestFilter; 
	
	@Value("${amazonProperties.accessKey}")
	private String accessKey;
	
	@Value("${amazonProperties.secretKey}")
	private String secretKey;
	
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
	
	@Bean
	public AmazonS3 amazonS3() {
		AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
		return new AmazonS3Client(credentials);
	}
	
	@Bean
	public AmazonDynamoDB amazonDynamoDB() {
		BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey,secretKey);
		AmazonDynamoDB client = AmazonDynamoDBClient.builder()
						.withCredentials(new AWSStaticCredentialsProvider(credentials))
						.withRegion(Regions.AP_SOUTH_1).build();
		return client;
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		http.csrf().disable();
		http.exceptionHandling().authenticationEntryPoint(appAuthenticationEntryPoint);
		
		http.httpBasic().disable()
			.formLogin().disable()
			.logout().disable()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();
		
		http.authorizeRequests().antMatchers("/kyk/authenticate").permitAll()
								.antMatchers("/kyk/**").authenticated();
								//.antMatchers("/kyk/**").permitAll();
		http.headers().cacheControl();
		
		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
	}
	@Override
    public void configure(WebSecurity webSecurity) throws Exception {
        webSecurity
            .ignoring()
            .antMatchers(
                HttpMethod.POST,
                "/kyk/authenticate"
            )
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .and()
            .ignoring()
            .antMatchers(
                HttpMethod.GET,
                "/" //Other Stuff You want to Ignore
            );
    }
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception{
		auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(passwordEncoder());
	}
}

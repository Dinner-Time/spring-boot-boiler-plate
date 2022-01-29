package com.ezen.boilerplate.common.config.loginHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class LoginSuccessHandler implements AuthenticationSuccessHandler{

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, //
      HttpServletResponse response, //
      Authentication authentication //
  ) throws IOException, ServletException 
  {
    UserDetails user = (UserDetails) authentication.getPrincipal();
    request.getSession().setAttribute("user", user);

    response.sendRedirect("/");
  }
  
}
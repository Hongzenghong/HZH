package com.ssm.crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssm.crud.bean.Department;
import com.ssm.crud.bean.Msgs;
import com.ssm.crud.service.DepartmentService;
/*
 * 处理和部门有关的请求
 */
@Controller
public class DepartmentController {
	@Autowired
     private DepartmentService departmentService;
	 @RequestMapping("/depts")
	 @ResponseBody
	 public Msgs getDepts() {
		 List<Department> list=departmentService.getDepts();
		 return Msgs.success().add("depts", list);
	 }
}

package com.ssm.crud.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.ssm.crud.bean.Employee;
import com.ssm.crud.bean.Msgs;
import com.ssm.crud.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.annotation.RequestScope;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * Created by Administrator on 2018/10/12.
 */
@Controller
public class EmployeeController {
	@Autowired
	EmployeeService employeeService;
	/**
	 * 单个批量二合一
	 * 批量：1-2-3
	 * 单个 ：1
	 * 删除
	 */
	@ResponseBody
	@RequestMapping(value="/emp/{ids}",method=RequestMethod.DELETE)
	public Msgs deleteEmp(@PathVariable("ids")String ids) {
		if(ids.contains("-")){
			List<Integer> del_ids = new ArrayList<>();
			String[] str_ids = ids.split("-");
			//组装id的集合
			for (String string : str_ids) {
				del_ids.add(Integer.parseInt(string));
			}
			employeeService.deleteBatch(del_ids);
		}else{
			Integer id = Integer.parseInt(ids);
			employeeService.deleteEmp(id);
		}
		return Msgs.success();
	}
	
	/**
	 * 如果直接发送ajax=PUT形式的请求封装的数据求
	 * 问题：
	 * 请求体中有数据
	 * 但是Employee对象封装不上
	 * update tbl_emp where emp_id=1024
	 * 
	 * 原因： 
	 * tomcat
	 * 		
	 * 
	 * AJAX 发送PUT请求引发的血案
	 * PUT请求，请求体中的数据拿不到
	 * tomcat一看是PUT不会封装请求体中的数据map,只有POST形式的请求才封装请求体为map
	 * 员工更新
	 * @param employee 
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="/emp/{empId}",method=RequestMethod.PUT)
	public Msgs saveEmp(Employee employee,HttpServletRequest request) {
		//System.out.println("将要更新的员工数据："+employee);
		employeeService.updateEmp(employee);
		return Msgs.success();
	}
	
	
	
	/**
	 * 根据id查询员工
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/emp/{id}",method=RequestMethod.GET)
	@ResponseBody
	 public Msgs getEmp(@PathVariable("id")Integer id) {
	Employee employee=employeeService.getEmp(id);
		return Msgs.success().add("emp",employee);
	}
	
	/**
	 * 检查用户名  是否可用
	 * @param empName
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/checkuser")
	public Msgs checkuser(@RequestParam("empName")String empName) {
		//先判断用户名是否合法的表达式
		String regx="(^[a-zA-Z0-9_-]{6,16}$)|(^[\u2E80-\u9FFF]{2,5})";
		if(!empName.matches(regx)) {
			return Msgs.fail().add("va_msg", "用户名必须是6-16位的数字和字母的组合或着2-5个中文");
		}
		//数据库用户名重复检验
		boolean b =employeeService.checkUser(empName);
		if(b) {
			return Msgs.success();
		}else {
			return Msgs.fail().add("va_msg", "用户名不可用");
		}
	}
	
	/**
	 * 员工保存
	 * 
	 */
    @RequestMapping(value="/emp",method=RequestMethod.POST)
    @ResponseBody
    public Msgs saveEmp(@Valid Employee employee,BindingResult result) {
    	if(result.hasErrors()) {
    		//检验失败，应该返回失败，在模态框中显示校验失败的错误信息
    		Map<String,Object> map=new HashMap<String, Object>();
    	 List<FieldError> error =  result.getFieldErrors();
    	 for (FieldError fieldError : error) {
			System.out.println("错误的字段名："+fieldError.getField());
			System.out.println("错误信息"+fieldError.getDefaultMessage());
			map.put(fieldError.getField(), fieldError.getDefaultMessage());
		}
    		return Msgs.fail().add("errorFields", map);
    	}
    	else {
    		employeeService.saveEmp(employee);
        	return Msgs.success();
    	}
    	
    }
    
    /**
     * 查询员工数据（分页查询）
     * @return
     */
	@RequestMapping("/emps")
	@ResponseBody
	public Msgs getEmpsWithJson(@RequestParam(value = "pn", defaultValue = "1") Integer pn) {
		// 这不是一个分页查询
		// 引入Pagehelper
		// 在查询之前调用,传入页码，以及每页的大小
		PageHelper.startPage(pn, 5);
		// StartPage后面紧跟的查询就是分页查询
		List<Employee> emps = employeeService.getAll();
		// 使用pageinfo包装查询的结果
		// 封装了详细的分页信息，包括我们查询出来的数据,连续显示的页数
		PageInfo page = new PageInfo(emps, 5);
		// return page;
		return Msgs.success().add("pageInfo", page);
	}
	
    /**
     * 查询员工数据（分页查询）
     * @return
     */
//   // @RequestMapping("/emps")
//    public  String getEmps(@RequestParam(value="pn",defaultValue="1") Integer pn,Model model){
//        //这不是一个分页查询
//        //引入Pagehelper
//        //在查询之前调用,传入页码，以及每页的大小
//        PageHelper.startPage(pn,5);
//        //StartPage后面紧跟的查询就是分页查询
//        List<Employee> emps=employeeService.getAll();
//        //使用pageinfo包装查询的结果
//        //封装了详细的分页信息，包括我们查询出来的数据,连续显示的页数
//        PageInfo page=new PageInfo(emps,5);
//        model.addAttribute("pageInfo",page);
//        return  "list";
//    }
}

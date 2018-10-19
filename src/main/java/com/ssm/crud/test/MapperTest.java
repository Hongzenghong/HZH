package com.ssm.crud.test;


import com.ssm.crud.bean.Department;
import com.ssm.crud.bean.Employee;
import com.ssm.crud.dao.DepartmentMapper;

import com.ssm.crud.dao.EmployeeMapper;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.UUID;

/**
 * 测试dao层
 * Created by Administrator on 2018/10/11.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class MapperTest {
    @Autowired
    DepartmentMapper departmentMapper;
    @Autowired
    EmployeeMapper employeeMapper;

    @Autowired
    SqlSession sqlSession;
    @Test
    public void testCRUD() {
        //  departmentMapper.insert(new Department(4,"开发部"));
        //  departmentMapper.insertSelective(new Department(1,"测试部"));

        //生成员工数据，测试员工插入
        //employeeMapper.insertSelective(new Employee(null,"jerry" ,"M","Jerry@ssm.com",1));

        //批量插入多个员工；使用可以执行批量操作sqlSession
        EmployeeMapper mapper = sqlSession.getMapper(EmployeeMapper.class);
        for(int i=0;i<1000;i++){
            String uid=UUID.randomUUID().toString().substring(0,5)+""+i;
           mapper.insertSelective(new Employee(null,uid,"M","@ccom",1));
           // mapper.deleteByPrimaryKey(i);
        }
        System.out.println("批量完成");
    }

}

package com.gis.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.gis.entity.Admin;
import com.gis.service.AdminService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
public class BussinessController {
    @Resource
    private AdminService adminService;

    /*echarts测试*/
    @RequestMapping(value = "/echarts")
    public String getEcharts(){
        return "chartShow";
    }

    /*登录验证*/
    @RequestMapping("/adminValidate")
    public String adminValidate(@RequestBody String adminString, HttpSession session) throws Exception{
        System.out.println(adminString);
        JSONObject adminjson = JSON.parseObject(adminString);
        System.out.println(adminjson.toString());
        String adminName = adminService.base64Decoder((String) adminjson.getString("adminName"));
        String password = adminService.base64Decoder((String) adminjson.getString("password"));

        Admin admin = adminService.adminValidate(adminName, password);
        if (admin!=null){
            session.setAttribute("adminInCharge", admin);
            session.setAttribute("loginState", "success");/*也可以转换为json字符串返回给前端*/
            System.out.println("admin login success");
            admin.setAdminName(adminService.base64Encoder(admin.getAdminName()));
            admin.setPassword(adminService.base64Encoder(admin.getPassword()));
            admin.setEmail(adminService.base64Encoder(admin.getEmail()));
            return JSON.toJSONString(admin);
        }
        session.setAttribute("loginState", "failure");
        return JSON.toJSONString("0");
    }

    //以下方法的返回值有待修改
    /*增加管理员*/
    @RequestMapping("/addAdmin")
    public String addAdmin(@RequestBody String adminString) throws Exception{
        JSONObject jsonObject = JSON.parseObject(adminString);
        String adminName = (String) jsonObject.get("adminName");
        String password = (String) jsonObject.get("password");
        String email = (String) jsonObject.get("email");
        adminService.addAdmin(adminName, password, email);
        System.out.println("Add admin success");
        return "success";//返回前端
    }

    /*删除管理员*/
    @RequestMapping("/deleteAdmin")
    public String deleteAdmin(@RequestBody String adminString) throws Exception{
        JSONObject jsonObject = JSON.parseObject(adminString);
        String adminName = (String) jsonObject.get("adminName");
        String password = (String) jsonObject.get("password");

        adminService.deleteAdmin(adminName, password);
        System.out.println("Delete admin success");
        return "success";
    }

    /*获得所有管理员*/
    @RequestMapping("getAllAdmins")
    @ResponseBody
    public String getAllAdmins(HttpSession session) throws Exception{
        List<Admin> admins = adminService.getAllAdmins();
        if (admins!=null){
            System.out.println("Get all admins success");
            session.setAttribute("allAdmins", admins);
            return "success";
        }
        return "error";
    }
}

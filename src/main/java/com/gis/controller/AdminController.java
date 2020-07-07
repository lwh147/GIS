package com.gis.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.gis.entity.admin.Admin;
import com.gis.service.AdminService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
public class AdminController {
    @Resource
    private AdminService adminService;

    /*登录验证*/
    @RequestMapping("/adminValidate")
    public String adminValidate(@RequestBody String adminString, HttpSession session) throws Exception {
        System.out.println(adminString);
        JSONObject adminjson = JSON.parseObject(adminString);
        System.out.println(adminjson.toString());
        String adminName = adminService.base64Decoder(adminjson.getString("adminName"));
        String password = adminService.base64Decoder(adminjson.getString("password"));

        Admin admin = adminService.adminValidate(adminName, password);
        if (admin != null) {
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

    /*增加管理员*/
    @RequestMapping("/addAdmin")
    public String addAdmin(@RequestBody String adminString) throws Exception {
        JSONObject jsonObject = JSON.parseObject(adminString);
        String adminName = (String) jsonObject.get("newUserName");
        String password = (String) jsonObject.get("newUserPassword");
        String email = (String) jsonObject.get("newUserEmail");
        adminService.addAdmin(adminName, password, email);
        System.out.println("Add admin success");
        return JSON.toJSONString("1");//返回前端
    }

    /*删除管理员*/
    @RequestMapping("/deleteAdmin")
    public String deleteAdmin(@RequestBody String adminString) throws Exception{
        JSONObject jsonObject = JSON.parseObject(adminString);
        String adminName = (String) jsonObject.get("adminName");
        String password = (String) jsonObject.get("password");

        adminService.deleteAdmin(adminName, password);
        System.out.println("Delete admin success");
        return JSON.toJSONString("1");
    }

    /*获得所有管理员*/
    @RequestMapping("/getAllAdmins")
    public String getAllAdmins(HttpSession session) throws Exception {
        List<Admin> admins = adminService.getAllAdmins();
        if (admins != null) {
            System.out.println("Get all admins success");
            return JSON.toJSONString(admins);
        }
        return JSON.toJSONString("0");
    }
}

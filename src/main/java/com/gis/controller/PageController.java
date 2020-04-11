package com.gis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {

    //访问项目根目录时转到管理员登陆页面
    @RequestMapping("/")
    public String AdminLogin() {
        return "adminLogin";
    }

    //加载主界面
    @RequestMapping("/index")
    public String AdminIndex() {
        return "index";
    }

    //加载管理员登陆页面模态框
    @RequestMapping("/adminLogin_modal")
    public String AdminLogin_modal() {
        return "adminLogin_modal";
    }

    //加载系统主页导航栏
    @RequestMapping("/index_navbar")
    public String index_navbar() {
        return "index_navbar";
    }

}

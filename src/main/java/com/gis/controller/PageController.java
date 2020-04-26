package com.gis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {

    //访问项目根目录时转到管理员登陆页面
    @RequestMapping("/")
    public String adminLogin() {
        return "adminLogin";
    }

    //加载主界面
    @RequestMapping("/index")
    public String adminIndex() {
        return "index";
    }

    //加载管理员登陆页面模态框
    @RequestMapping("/adminLogin_modal")
    public String adminLogin_modal() {
        return "adminLogin_modal";
    }

    //加载系统主页导航栏
    @RequestMapping("/index_navbar")
    public String index_navbar() {
        return "index_navbar";
    }

    //加载系统主页导航栏
    @RequestMapping("/index_body_index")
    public String index_body_index() {
        return "index_body_index";
    }

    //加载管理员账户信息
    @RequestMapping("/index_body_adminInfo")
    public String index_body_adminInfo() {
        return "index_body_adminInfo";
    }

    //加载管理员账户信息
    @RequestMapping("/index_body_adminInfo_modal")
    public String index_body_adminInfo_modal() {
        return "index_body_adminInfo_modal";
    }

    //加载页脚
    @RequestMapping("/index_foot")
    public String index_foot() {
        return "index_foot";
    }
}

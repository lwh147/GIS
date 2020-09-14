/**
 * 作者: lwh
 * 时间: 2020.4.10
 * 描述: 管理系统主页初始化js
 */
$(document).ready(function () {
    //判断是否存在登录用户-------------------
    //isLogged();

    //初始化全局变量
    getGlobalVars();

    //加载导航栏和页脚以及网页主体
    loadNavAndFoot();
});

/**
 * 作者: lwh
 * 时间: 2020.4.14
 * 描述: 判断是否存在登录用户---------
 */
function isLogged() {
    $.ajax({
        url: "",
        type: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            if (data === "0")
                logout();
        },
        error: function (error) {
            alert("----ajax请求验证是否存在登录用户执行出错！错误信息如下：----\n" + error.responseText);
        }
    });
}

/**
 * 作者: lwh
 * 时间: 2020.4.13
 * 描述: 获取管理员信息和刷新网页前的操作信息
 */
function getGlobalVars() {
    //获取登陆的管理员信息
    let strArr = window.sessionStorage.getItem("loggedAdminInfo").split("_");
    loggedAdminInfo = {
        adminName: window.atob(strArr[0]),
        password: window.atob(strArr[1]),
        email: window.atob(strArr[2])
    };
    //获取网页加载前进行的操作
    let cno = window.sessionStorage.getItem("cno");
    //如果为空加载首页，如果不为空说明刷新网页前处于非首页状态
    if (cno !== null)
        currentComponent = cno;
}

/**
 * 作者: lwh
 * 时间: 2020.7.8
 * 描述: 加载导航栏和页脚以及网页主体
 */
function loadNavAndFoot() {
    //加载导航栏
    loadSingleComponent(systemComponents.c0, "#index-navbar-container");
    //加载页脚
    loadSingleComponent(systemComponents.c1, "#index-foot-container");
    //加载当前正在访问的内容
    loadBody();
}

/**
 * 作者: lwh
 * 时间: 2020.7.8
 * 描述: 加载网页主体
 */
function loadBody() {
    let tabs = $("#index-navbar ul > li > a");
    $.each(tabs, function (key, value) {
        //触发对用组件的功能标签的点击事件便会重新加载用户刷新页面之前的组件
        if ($(value).text().replace(/\s/g, "") === eval("systemComponents.c" + currentComponent + ".cname")) {
            $(value).trigger("click");
        }
    });
}
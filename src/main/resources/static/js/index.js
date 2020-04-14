//全局变量

//存储当前已登录的用户信息，方便函数调用
let index_loggedAdminInfo;
//记录当前用户的操作以便于刷新页面后重新加载
let index_currentOperation = {
    funName: "showAdminInfo()"
};

/**
 * 作者: lwh
 * 时间: 2020.4.10
 * 描述: 管理系统主页初始化js
 */
$(document).ready(function () {
    //判断是否存在登录用户
    //isLogged();

    //初始化全局变量
    getGlobalVars();

    //加载并初始化导航栏
    loadNavbar();

    //根据保存的当前操作加载对应内容
    eval(index_currentOperation.funName);

    //加载并初始化页脚
    loadFoot();
});
/**
 * 作者: lwh
 * 时间: 2020.4.14
 * 描述: 判断是否存在登录用户
 */
function isLogged() {
    $.ajax({
        url: "",
        type: "get",
        async: false,
        dataType: "json",
        sussess: function (data) {
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
 * 描述: 获取管理员信息
 */
function getGlobalVars() {
    index_loggedAdminInfo = {
        adminId: window.sessionStorage.getItem("adminId"),
        adminName: window.atob(window.sessionStorage.getItem("adminName")),
        password: window.atob(window.sessionStorage.getItem("password")),
        email: window.atob(window.sessionStorage.getItem("email"))
    };
    let funName = window.sessionStorage.getItem("funName");
    if (funName !== null){
        index_currentOperation = {
            funName: window.atob(funName)
        }
    }
}
/**
 * 作者: lwh
 * 时间: 2020.4.10
 * 描述: 加载导航栏
 */
function loadNavbar() {
    //获取
    $.ajax({
        url: "index_navbar",
        type: "get",
        async: false,
        dataType: "html",
        success: function (data) {
            //加载
            $("#index-head-navbar-container").append(data);
            //初始化导航栏
            initIndexNavbar();
        },
        error: function (error) {
            alert("----ajax请求加载导航栏执行出错！错误信息如下：----\n" + error.responseText);
        }
    });
}
/**
 * 作者: lwh
 * 时间: 2020.4.13
 * 描述: 加载网页主体首页
 */
function loadIndexBodyIndex() {
    //获取
    $.ajax({
        url: "index_body_index",
        type: "get",
        async: false,
        dataType: "html",
        success: function (data) {
            //加载
            $("#index-body-container").append(data);
            //更新当前操作
            index_currentOperation = {
                funName: "loadIndexBodyIndex()"
            };
            saveData2Ses(index_currentOperation);
        },
        error: function (error) {
            alert("----ajax请求加载index_body_index执行出错！错误信息如下：----\n" + error.responseText);
        }
    });
}
/**
 * 作者: lwh
 * 时间: 2020.4.12
 * 描述：显示登录管理员的信息
 */
function showAdminInfo() {
    if (!isLoaded("index-body-adminInfo")){
        //获取
        $.ajax({
            url: "index_body_adminInfo",
            type: "get",
            async: false,
            dataType: "html",
            success: function (data) {
                //加载
                $("#index-body-container").append(data);
                //初始化管理员信息页面
                initAdminInfo();
                //更新当前操作
                index_currentOperation = {
                    funName: window.btoa("showAdminInfo()")
                };
                saveData2Ses(index_currentOperation);
            },
            error: function (error) {
                alert("----ajax请求加载adminInfo执行出错！错误信息如下：----\n" + error.responseText);
            }
        });
    }
}
/**
 * 作者: lwh
 * 时间: 2020.4.12
 * 描述: 添加管理员
 */
function addAdmin() {

}
/**
 * 作者: lwh
 * 时间: 2020.4.12
 * 描述: 退出登录
 */
function logout() {
    $(window).attr("location", "/gis");
}
/**
 * 作者: lwh
 * 时间: 2020.4.13
 * 描述: 加载页脚
 */
function loadFoot() {
    //获取
    $.ajax({
        url: "index_foot",
        type: "get",
        async: false,
        dataType: "html",
        success: function (data) {
            //加载
            $("#index-foot-container").append(data);
        },
        error: function (error) {
            alert("----ajax请求加载页脚执行出错！错误信息如下：----\n" + error.responseText);
        }
    });
}
/**
 * 作者: lwh
 * 时间: 2020.4.14
 * 描述: 判断一个组件是否存在
 */
function isLoaded(id) {
    return $("#" + id).length !== 0;
}

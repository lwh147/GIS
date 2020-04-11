/**
 * 作者: lwh
 * 时间: 2020.4.10
 * 描述: 管理系统主页js
 */

//全局变量，存储当前已登录的用户信息，方便下次使用
let index_loggedAdminInfo;

$(document).ready(function () {

    //获取已登录的管理员信息
    index_loggedAdminInfo = {
        adminId: window.sessionStorage.getItem("adminId"),
        adminName: window.atob(window.sessionStorage.getItem("adminName")),
        password: window.atob(window.sessionStorage.getItem("password")),
        email: window.atob(window.sessionStorage.getItem("email"))
    };

    //删除已登录的管理员信息
    $.each(index_loggedAdminInfo, function (key, value) {
        window.sessionStorage.removeItem(key);
    });

    //加载导航栏
    loadNavbar();

});
/**
 * 作者: lwh
 * 时间: 2020.4.10
 * 描述: 加载导航栏
 */
function loadNavbar() {
    //加载导航栏
    $.ajax({
        url: "index_navbar",
        type: "get",
        async: false,
        dataType: "html",
        success: function (data) {
            //加载到导航栏
            $("#index-head-navbar-container").append(data);
            //更新导航栏已登录管理员信息
            $("#index-navbar-adminName").text("您好，"+index_loggedAdminInfo.adminName);
        },
        error: function (error) {
            alert("----ajax请求加载导航栏执行出错！错误信息如下：----\n" + error.responseText);
        }
    });
}
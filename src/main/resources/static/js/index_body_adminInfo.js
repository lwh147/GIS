/**
 * 作者: lwh
 * 时间: 2020.4.12
 * 描述：显示登录管理员信息页面的初始化
 */
function initAdminInfo() {
    //管理员信息显示页面的初始化相关工作
    $("#adminInfo-hello-adminName").text("您好，" + index_loggedAdminInfo.adminName + "!");
    $("#adminInfo-hello-email").text(index_loggedAdminInfo.email);
}
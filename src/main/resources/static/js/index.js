/**
 * 作者: lwh
 * 时间: 2020.4.10
 * 描述: 管理系统主页js
 */
$(document).ready(function () {
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
            $("#index-head-navbar-container").append(data);
        },
        error: function (error) {
            alert("----ajax请求加载导航栏执行出错！错误信息如下：----\n" + error.responseText);
        }
    });
}
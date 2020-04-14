/**
 * 作者: lwh
 * 时间: 2020.4.13
 * 描述: 导航栏初始化
 */
function initIndexNavbar(){
    //更新导航栏已登录管理员信息
    $("#index-navbar-adminName").text("您好，"+index_loggedAdminInfo.adminName);
    //搜索框输入验证
    $("#index-navbar-searchFrom").bootstrapValidator({
        //提示信息放到指定区域
        container: "#errors",
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
        },
        fields: {
            searchContentInput: {
                validators: {
                    notEmpty:{
                        message: "请输入任何关键字以进行搜索！"
                    }
                }
            }
        }
    }).on("success.form.bv", function(e) {
        //注册表单被提交后且验证成功的事件的监听函数以使用ajax提交表单数据
        //阻止正常提交表单
        e.preventDefault();
        //--------------------------------------搜索处理
        console.log("未进行搜索处理");
    });
}
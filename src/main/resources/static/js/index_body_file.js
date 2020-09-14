/**
 * 作者: lwh
 * 时间: 2020.7.20
 * 描述: 文件管理初始化js
 */
function index_body_file_init() {
    //下载按钮监听器注册
    $("#file-form fieldset button:eq(0)").on("click", function () {
        window.open("/src/file/fileTemplates/" + $("#templateSelect").val() + ".xlsx");
    });

    //默认上传按钮监听器绑定
    $("#file-form fieldset button:eq(1)").bind("click", function () {
        //获取文件
        let file = $("#uploadFile").prop("files")[0];
        //判断是否选择文件
        if ((typeof file) === "undefined")
            myAlert("请选择导入数据后的模板Excel表格文件后进行上传！");
    });

    //使用jquery.fileupload插件上传文件
    $("#uploadFile").fileupload({
        //ajax相关设置
        url: "/dataUpload",
        type: "post",
        dataType: "json",
        //jquery.fileupload相关设置
        //文件上传成功回调函数
        done: function (e, data) {
            if (data.result.result === "0")
                myAlert("文件上传失败!");
            else {
                //取消进度条动画
                $("#file-form .progress .progress-bar").removeClass("active");
                //显示成功颜色
                $("#file-form .progress .progress-bar").addClass("progress-bar-success");
                //更改进度信息
                $("#file-form .progress .progress-bar").html("上传成功！");
            }
        },
        //文件上传失败回调函数
        fail: function () {
            myAlert("文件上传失败!");
        },
        autoUpload: false,  //关闭自动上传
        replaceFileInput: false,    //关闭input标签替换
        //为文件输入框添加文件时回调函数
        add: function (e, data) {
            //解绑上次绑定的监听函数
            $("#file-form fieldset button:eq(1)").unbind("click");
            //绑定监听函数
            $("#file-form fieldset button:eq(1)").bind("click", function () {
                //获取文件
                let file = $("#uploadFile").prop("files")[0];
                //判断是否选择了文件
                if ((typeof file) === "undefined") {
                    myAlert("请选择导入数据后的模板Excel表格文件进行上传！");
                    return;
                }
                //判断文件类型
                if (!file.name.endsWith(".xlsx")) {
                    myAlert("只能上传Microsoft Excel Worksheet(.xlsx)文件!");
                    return;
                }
                //判断文件大小
                if (file.size > uploadFileSize) {
                    myAlert("文件大小最大为100MB!");
                    return;
                }
                //取消成功状态
                $("#file-form .progress .progress-bar").removeClass("progress-bar-success");
                //初始化进度信息
                $("#file-form .progress .progress-bar").css("width", "0");
                $("#file-form .progress .progress-bar").html(0 + "%");
                //开始上传
                data.submit();
                //激活进度条动画
                $("#file-form .progress .progress-bar").addClass("active");
            });
        },
        //全局上传事件进度监听回调
        progressall: function (e, data) {
            //计算进度
            let progress = parseInt((data.loaded / data.total * 100).toFixed(2), 10);
            //更改进度条宽度
            $("#file-form .progress .progress-bar").css("width", progress + "%");
            //更改进度显示
            $("#file-form .progress .progress-bar").html(progress + "%");
        }
    });
}
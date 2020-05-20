//显示图标页面需要用到的组件
let chart_components = {
    c0: {
        clfn: "loadSidebar()",
        cname: "侧边导航栏",
        cid: "index-body-sidebar",
        curl: "index_body_sidebar"
    }
};

/**
 * 作者: lwh
 * 时间: 2020.5.20
 * 描述: 图表展示主页初始化
 */
function initChart() {
    eval(chart_components.c0.clfn);
}

/**
 * 作者: lwh
 * 时间: 2020.5.20
 * 描述: 加载侧边导航栏
 */
function loadSidebar() {
    if (!isLoaded(chart_components.c0.cid)) {
        $.ajax({
            url: chart_components.c0.curl,
            type: "get",
            async: true,
            dataType: "html",
            success: function (data) {
                $("#index-body-chart").append(data);
                //初始化侧边栏
                initSidebar();
            },
            error: function (error) {
                alert("----ajax请求加载侧边导航栏执行出错！错误信息如下：----\n" + error.responseText);
            }
        });
    }
}
/**
 * 作者: lwh
 * 时间: 2020.5.20
 * 描述: 侧边导航栏初始化
 */
function initSidebar() {
    $(".sidebar .btn-sidebar").click(sidebar);
    $(".sidebar .sidebar-prompt").click(sidebar);

    $(".sidebar ul li ul li").click(function () {
        $(".sidebar ul li ul li").removeClass("active");
        $(this).addClass("active");
    });
}

/**
 * 作者: lwh
 * 时间: 2020.5.20
 * 描述: 侧边导航栏隐藏、展示动画所需的点击事件处理
 */
function sidebar() {
    $(".sidebar .btn-sidebar").toggleClass("btn-side");
    $(".sidebar").toggleClass("side");
    $(".sidebar > div").toggleClass("sidebar-prompt");
}
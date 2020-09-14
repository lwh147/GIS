function index_body_index_init() {
    map_mapInitial();
    $(".hamburger").click(function () {
        $(this).toggleClass("is-active");
    });
    mapChartInitial();
}

//初始化地图
function map_mapInitial() {
    const normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
        maxZoom: 20,
        minZoom: 5
    }), normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
        maxZoom: 20,
        minZoom: 5
    }), imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
        maxZoom: 20,
        minZoom: 5
    }), imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
        maxZoom: 20,
        minZoom: 5
    });

    const googleNormal = L.tileLayer.chinaProvider("Google.Normal.Map", {
        maxZoom: 20,
        minZoom: 5
    }), googleSate = L.tileLayer.chinaProvider("Google.Satellite.Map", {
        maxZoom: 20,
        minZoom: 5
    });


    const normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]),
        googleMap = L.layerGroup([googleSate]);

    const baseLayers = {
        "天地图": image,
        "Google": googleMap
    }, overlayLayers = {
        //"行政地图": normal
    };

    /*天地图坐标定位 40.435071, 109.607786
    * 正常地图定位 40.271171, 109.363286
    * Google地块中心定位 LatLng(40.434209, 109.600875)
    * 天地图地块中心定位 LatLng(40.433294, 109.595275)
    * 1 LatLng(40.435552, 109.595409)
    * 2 LatLng(40.433781, 109.598161)
    * 3 LatLng(40.431398, 109.596847)
    * 4 LatLng(40.431586, 109.593349)
    * 5 LatLng(40.434128, 109.592528)
    * 109.604545, 40.4379
    **/
    const googleCenter = [40.434209, 109.600875];
    const tianDiTuCenter = [40.433294, 109.595275];
    const locationData = [40.435071, 109.607786];
    const fieldLatlngs = [
        [
            [40.434586, 109.595382],
            [40.435664, 109.595511],
            [40.43648, 109.59564]
        ],
        [
            [40.43364, 109.596927],
            [40.433868, 109.598365],
            [40.434064, 109.599352]
        ],
        [
            [40.432269, 109.596026],
            [40.43124, 109.596884],
            [40.430571, 109.597335]
        ],
        [
            [40.432397, 109.59424],
            [40.431484, 109.593247],
            [40.430846, 109.592528]
        ],
        [
            [40.433917, 109.593709],
            [40.434162, 109.592357],
            [40.434456, 109.591413]
        ]
    ];
    const map = L.map("testMap", {
        center: locationData,
        zoom: 15,
        layers: [image],
        zoomControl: false
    });
    L.control.layers(baseLayers, overlayLayers).addTo(map);
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);
    /*比例尺*/
    L.control.scale().addTo(map);
    /*地图测量*/
    L.control.measure({
        position: "topleft"
    }).addTo(map);
    /*地图交互*/
    map.pm.addControls({
        position: "topleft"
    });
    console.log("before draw");
    //popTest(map);
    mapDrawField(tianDiTuCenter, map);
    console.log("after draw");
    bindImage(fieldLatlngs, map);
    console.log("after bind");
    //let markers = addMarker(markerLonLngs, map);
    //fieldOutline(tianDiTuCenter, startAngle, 250, map);
    infoTipListener();
    $(".hamburger").toggleClass("is-active");
}

//初始化图表
function mapChartInitial() {
    let id = "1-1";
    let latlng = [40.43428, 109.595361];
    fieldInfo(id, latlng);
    swcChart(id);
    fwhChart(id);
}

//绘制地块
function mapDrawField(center, map) {
    let startAngle = [];
    for (let i = 0; i < 15; i++) {
        startAngle[i] = -30 + 24 * i;
    }
    let radius = [390, 320, 225];
    let infoGroup = [];
    for (let i = 0; i < radius.length; i++) {
        let tmpGroup = mapFieldOutline(center, startAngle[0], radius[i], map);
        infoGroup.push.apply(infoGroup, tmpGroup);
    }
    window.sessionStorage.setItem("fieldInfos", JSON.stringify(infoGroup));
}

//绘制一圈地块
function mapFieldOutline(latLng, startAngle, radius, paramMap) {
    let tmpAngle = startAngle;
    let fieldInfos = [];//地块信息，放置在session中
    for (let i = 0; i < 5; i++) {//应为5
        drawSector(latLng, radius, [tmpAngle, tmpAngle + 72], paramMap);
        let area = null;
        let area1 = Math.PI * 390 * 390;
        let area2 = Math.PI * 320 * 320;
        let area3 = Math.PI * 225 * 225;
        if (radius === 225) area = area3;
        if (radius === 320) area = area2 - area3;
        if (radius === 390) area = area1 - area2;

        let fieldInfo = {
            id: mapCalculateID(tmpAngle, radius),
            area: (area / 5).toFixed(3)
        };
        tmpAngle += 72;//
        fieldInfos.push(fieldInfo);
    }
    return fieldInfos;
}

//转换角度和半径为地块编号
function mapCalculateID(angle, radius) {
    let id = "";
    switch (angle) {
        case -30:
            id = "1";
            break;
        case 42:
            id = "2";
            break;
        case 114:
            id = "3";
            break;
        case 186:
            id = "4";
            break;
        case 258:
            id = "5";
            break;
    }
    switch (radius) {
        case 225:
            id += "-1";
            break;
        case 320:
            id += "-2";
            break;
        case 390:
            id += "-3";
            break;
    }
    return id;
}

//为地图上标记绑定实际照片
function bindImage(latlngs, paramMap) {
    for (let i = 0; i < latlngs.length; i++) {
        let markers = L.markerClusterGroup();
        for (let j = 0; j < latlngs[i].length; j++) {
            let marker = addMarker(latlngs[i][j]);
            let url = "/src/fieldImages/" + (i + 1) + "-" + (j + 1) + ".JPG";
            console.log("bind " + url);
            marker.bindPopup("<a href='" + url + "' target='_blank'><img src='" + url + "' style='width: 300px; height: 300px'/></a>");
            markers.addLayer(marker);
        }
        markers.addTo(paramMap);
    }
}

//添加标记
function addMarker(latLng) {
    return L.marker(latLng, {
        title: "I'm a marker",
        icon: L.BeautifyIcon.icon({
            icon: "leaf",
            iconShape: "marker"
        })
    });
}

//画圆
//@Param1 地块坐标
//@Param2 半径
//@Param3 地图
function drawMyCircle(latLng, radius, paramMap) {
    return L.circle(latLng, {
        radius: radius,
        color: "#389466",
        weight: 2
    }).addTo(paramMap);
}

//画扇形
//@Param1 地块坐标
//@Param2 半径
//@Param3 起始终止角度
//@Param4 地图
function drawSector(latLng, radius, angles, paramMap) {

    let sector = L.semiCircle(latLng, {
        radius: radius,
        color: "#389466",
        weight: 2,
        startAngle: angles[0],
        stopAngle: angles[1]
    }).addTo(paramMap);
    sector.on("click", function (event) {
        let fieldId = mapCalculateID(angles[0], radius);
        //addMarker(event.latlng, paramMap);
        //调试后取消注释
        fieldInfo(fieldId, event.latlng);
        swcChart(fieldId);
        fwhChart(fieldId);
    });
    return sector;
}

//给定圆心，半径和角度，计算圆弧上点画折线来接近圆弧,clockwise
//但在leaflet地理坐标系中，坐标以经纬度表示，距离用m表示，直接计算加上并不对
//故在项目中特殊处理，先取定了圆弧上一个点，计算与圆心在坐标系中距离作为半径
//return 折线数组

function getArcPoints(center, radius, startAngle, angle, pointNum) {
    let points = [];
    console.log("center is " + center);
    for (let i = 0; i <= pointNum; i++) {
        let current = (startAngle + angle * i / pointNum) * Math.PI / 180;
        let cos = Math.cos(current);
        let sin = Math.sin(current);
        points.push([center[0] + radius * cos, center[1] + radius * sin]);
        console.log("radius is " + radius);
        console.log("cos is " + cos + " sin is " + sin);
    }
    return points;
}

//calculate distance of two points
function getDistance(point1, point2) {
    let x = point1[0] - point2[0];
    let y = point1[1] - point2[1];
    return Math.sqrt(x * x + y * y).toFixed(9);
}

//画线段或折线
//@Param1 点坐标
//@Param2 地图
function drawLine(latLngs, paramMap) {
    return L.polyline(latLngs, {
        color: "#389466",
        weight: 2
    }).addTo(paramMap);
}

//弹出气泡测试
//@Param1 地图
let strs = "";
let newStrs = "";

function popTest(paramMap) {
    paramMap.on("click", function (event) {
        //strs += event.latlng.toString();
        let pop = L.popup();
        pop.setLatLng(event.latlng).setContent(event.latlng.toString()).openOn(paramMap);
    })
}

//转换坐标时使用函数
/*function transform() {
    if (strs !== "") {
        for (let i = 0;i < strs.length;i++) {
            if (strs.charAt(i) !== '(') continue;
            let secondPoint = i;
            while (strs.charAt(secondPoint) !== ')') {
                secondPoint++;
            }
            let latlng = strs.substring(i + 1, secondPoint);
            newStrs += "[" + latlng + "],\n";
            i = secondPoint;
        }
        console.log(newStrs);
    }else alert("str is null");
}*/

//info-tip监听
function infoTipListener() {
    $(".info-tip").on("click", function () {
        //transform();
        let infoWindow = $(".info-window");
        if (infoWindow.css("display") === "none") {
            $(".hamburger").addClass("is-active");
            $(infoWindow).fadeIn("normal", "linear");
        } else {
            $(".hamburger").removeClass("is-active");
            $(infoWindow).fadeOut("normal", "linear");
        }
    });
}

//地块信息图表
function fieldInfo(fieldId, latLng) {
    let infoData = window.sessionStorage.getItem("fieldInfos");
    infoData = JSON.parse(infoData);

    //div->table->tbody
    let tbody = $("#info-win-chart1").children().children()[0];
    let tds = $(tbody).children().children();
    $.each(infoData, function (index, value) {
        if (value.id === fieldId) {
            $(tds[1]).text(value.id);
            $(tds[3]).text(latLng.toString().substring(6));
            $(tds[5]).text(value.area);
        }
    });
}

//swc简图
function swcChart(fieldId) {
    let chartData = screenDataByAttr(getChartDataByCache("field/swcByDOY",
        JSON.stringify({DOY: "177"})), "nUM_1", fieldId);
    let xAxisData = extractCol(chartData, "nUM_3");
    let yAxisData = extractCol(chartData, "sWC");
    //console.log("yAxisData is " + yAxisData);
    let swcOption = {
        legend: {},
        tooltip: {},
        xAxis: {
            type: "category",
            name: "depth(cm)",
            nameLocation: "center",
            nameGap: 20,
            data: xAxisData.sort(function (a, b) {
                return a - b;
            })
        },
        yAxis: {
            name: "%"
        },
        series: [
            {
                type: "bar",
                name: "SWC",
                data: yAxisData
            }
        ]
    };
    getAndInitChart("info-win-chart2").setOption(swcOption);
}

//FWH简图
function fwhChart(fieldId) {
    let chartData = screenDataByAttr(getChartDataByCache("field/fwh", null, 0), "nUM_1", fieldId);
    let names = extractCol(chartData, "nUM_2");
    let messFWH = extractCol(chartData, "massWaterContent");
    let volumeFWH = extractCol(chartData, "volumeWaterContent");

    let messData = [], volumeData = [];
    for (let i = 0; i < names.length; i++) {
        messData.push({
            name: names[i],
            value: messFWH[i]
        });
        volumeData.push({
            name: names[i],
            value: volumeFWH[i]
        })
    }

    //图表在容器内部百分比，以宽高中较小的为基准
    let labelCfg = {};
    let option1 = {
        title: {
            subtext: "MessWaterContent",
            left: "50%",
            top: "80%",
            textAlign: "center"
        },
        legend: {},
        tooltip: {},
        series: {
            type: "pie",
            center: ["50%", "45%"],
            radius: "50%",
            data: messData,
            label: labelCfg
        }
    }, option2 = {
        title: {
            subtext: "VolumeWaterContent",
            left: "50%",
            top: "85%",
            textAlign: "center"
        },
        legend: {
            top: "5%"
        },
        tooltip: {},
        series: {
            type: "pie",
            center: ["50%", "50%"],
            radius: "50%",
            data: volumeData,
            label: labelCfg
        }
    };

    getAndInitChart("info-win-chart3").setOption(option1);
    getAndInitChart("info-win-chart4").setOption(option2);
}
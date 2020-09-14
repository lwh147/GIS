

function index_body_map_init() {
    infoMapInitial();
}

function infoMapInitial() {
    fieldInstances.length = 0;

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

    const normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);

    const baseLayers = {
        "天地图": image
    }, overlayLayers = {
        //"行政地图": normal
    };
    const tianDiTuCenter = [40.433294, 109.595275];
    const locationData = [40.433294, 109.600000];
    const map = L.map("themeMap", {
        center: locationData,
        zoom: 16,
        layers: [image],
        zoomControl: false
    });
    L.control.layers(baseLayers, overlayLayers).addTo(map);
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);

    let options = {
        data: {
            'dataPoint1': Math.random() * 20,
            'dataPoint2': Math.random() * 20,
            'dataPoint3': Math.random() * 20,
            'dataPoint4': Math.random() * 20
        },
        chartOptions: {
            'dataPoint1': {
                fillColor: '#FEE5D9',
                minValue: 0,
                maxValue: 20,
                maxHeight: 20,
                displayText: function (value) {
                    return value.toFixed(2);
                }
            },
            'dataPoint2': {
                fillColor: '#FCAE91',
                minValue: 0,
                maxValue: 20,
                maxHeight: 20,
                displayText: function (value) {
                    return value.toFixed(2);
                }
            },
            'dataPoint3': {
                fillColor: '#FB6A4A',
                minValue: 0,
                maxValue: 20,
                maxHeight: 20,
                displayText: function (value) {
                    return value.toFixed(2);
                }
            },
            'dataPoint4': {
                fillColor: '#CB181D',
                minValue: 0,
                maxValue: 20,
                maxHeight: 20,
                displayText: function (value) {
                    return value.toFixed(2);
                }
            }
        },
        weight: 1,
        color: '#000000'
    };
    let barChartMarker = new L.BarChartMarker(new L.LatLng(40.435071, 109.607786), options);
    map.addLayer(barChartMarker);
    infoDrawField(tianDiTuCenter, map);
    timeLine(map);
}

//绘制地块
function infoDrawField(center, map) {
    for (let i = 0; i < fields.length; i++) {
        fieldInstances.push(infoFieldOutline(fields[i], center, map));
    }
}

//绘制一个地块，共9个方块，三组
//@Param1 三维数组
//@Return 二维数组
function infoFieldOutline(latLngGroups, center, paramMap) {
    let field = [];
    for (let i = 0; i < latLngGroups.length; i++) {
        let group = [];
        //最内
        let block = latLngGroups[i][0];
        block.push(center);
        group.push(drawMyPolygon(block, paramMap));
        //中间
        let block0 = latLngGroups[i][0];
        let block1 = latLngGroups[i][1];
        group.push(drawMyPolygon(block1.concat(block0.slice().reverse()), paramMap));
        //最外
        //let block3 = latLngGroups[i][1];
        //console.log("block3: " + block3);
        let block2 = latLngGroups[i][2];
        //console.log("block2: " + block2);
        group.push(drawMyPolygon(block2.concat(block1.slice().reverse()), paramMap));

        field.push(group);
    }
    return field;
}

//画多边形
function drawMyPolygon(latLngs, paramMap) {
    return L.polygon(latLngs, {
        weight: 2,
        opacity: 1.0,
        fillOpacity: 0.7
    }).addTo(paramMap);
}

//根据属性计算映射颜色值
function calculateColor(props) {
    let calculator = new L.HSLHueFunction(new L.Point(30, 120), new L.Point(60, 0));
    let colors = [];
    for (let i = 0; i < props.length; i++) {
        colors.push(calculator.evaluate(props[i]));
    }
    return colors;
}

//设置时间线并绑定监听函数
function timeLine(paramMap) {
    let items = [177, 185, 189, 193, 198, 202, 207, 214, 221, 234];//天数
    let timeItems = [];
    for (let i = 0; i < items.length; i++)
        timeItems.push(String(items[i]) + '天');
    L.control.timelineSlider({
        timelineItems: timeItems,
        changeMap: changeMapListener
    }).addTo(paramMap);
}

//时间线监听函数
changeMapListener = function (data) {
    //console.log("label is " + label);
    let choice = data.label.substring(0, data.label.length - 1);
    let chartData = getChartDataByCache("corn/cornHeightAndChloDOY", JSON.stringify({DOY: choice}));
    let props = extractCol(chartData, "chlorophyll");
    //console.log("props is " + props);
    let colors = calculateColor(props);
    /*console.log("FieldInstance: " + fieldInstances.length + " "
        + fieldInstances[0].length + " "
        + fieldInstances[0][0].length);
    console.log("colors length: " + colors.length);*/
    for (let i = 0; i < colors.length; i++) {
        let fieldId = Math.floor(i / 9);
        let tmp = i - fieldId * 9;
        let groupId = Math.floor(tmp / 3);
        let blockId = tmp % 3;
        fieldInstances[fieldId][groupId][blockId].setStyle({
            color: colors[i],
            fillColor: colors[i]
        }).bindPopup("Chlo: " + props[i]);
    }
};
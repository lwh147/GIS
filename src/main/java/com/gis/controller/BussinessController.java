package com.gis.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.gis.entity.Admin;
import com.gis.entity.CornHeightAndChlo;
import com.gis.entity.CornLeaf;
import com.gis.entity.CornYield;
import com.gis.function.Tools;
import com.gis.service.AdminService;
import com.gis.service.CornService;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.List;
import java.net.URLEncoder;

@RestController
public class BussinessController {
    @Resource
    private AdminService adminService;
    @Resource
    private CornService cornService;

    //管理员信息操作相关部分-------------------------------------------------------------

    /*登录验证*/
    @RequestMapping("/adminValidate")
    public String adminValidate(@RequestBody String adminString, HttpSession session) throws Exception {
        System.out.println(adminString);
        JSONObject adminjson = JSON.parseObject(adminString);
        System.out.println(adminjson.toString());
        String adminName = adminService.base64Decoder((String) adminjson.getString("adminName"));
        String password = adminService.base64Decoder((String) adminjson.getString("password"));

        Admin admin = adminService.adminValidate(adminName, password);
        if (admin != null) {
            session.setAttribute("adminInCharge", admin);
            session.setAttribute("loginState", "success");/*也可以转换为json字符串返回给前端*/
            System.out.println("admin login success");
            admin.setAdminName(adminService.base64Encoder(admin.getAdminName()));
            admin.setPassword(adminService.base64Encoder(admin.getPassword()));
            admin.setEmail(adminService.base64Encoder(admin.getEmail()));
            return JSON.toJSONString(admin);
        }
        session.setAttribute("loginState", "failure");
        return JSON.toJSONString("0");
    }

    //以下方法的返回值有待修改
    /*增加管理员*/
    @RequestMapping("/addAdmin")
    public String addAdmin(@RequestBody String adminString) throws Exception {
        JSONObject jsonObject = JSON.parseObject(adminString);
        String adminName = (String) jsonObject.get("newUserName");
        String password = (String) jsonObject.get("newUserPassword");
        String email = (String) jsonObject.get("newUserEmail");
        adminService.addAdmin(adminName, password, email);
        System.out.println("Add admin success");
        return "1";//返回前端
    }

    /*删除管理员*/
    @RequestMapping("/deleteAdmin")
    public String deleteAdmin(@RequestBody String adminString) throws Exception {
        JSONObject jsonObject = JSON.parseObject(adminString);
        String adminName = (String) jsonObject.get("adminName");
        String password = (String) jsonObject.get("password");

        adminService.deleteAdmin(adminName, password);
        System.out.println("Delete admin success");
        return "success";
    }

    /*获得所有管理员*/
    @RequestMapping("getAllAdmins")
    public String getAllAdmins(HttpSession session) throws Exception {
        List<Admin> admins = adminService.getAllAdmins();
        if (admins != null) {
            System.out.println("Get all admins success");
            session.setAttribute("allAdmins", admins);
            return "success";
        }
        return "error";
    }

    //图表信息操作相关部分-------------------------------------------------------------

    /*获取所有cornLeaf数据*/
    @RequestMapping("/corn/cornLeafAll")
    public String getCornLeaf() throws Exception {
        List<CornLeaf> cornLeafList = cornService.getAllCornLeaf();
        if (cornLeafList != null) {
            String cornLeafJson = JSON.toJSONString(cornLeafList);
            System.out.println(cornLeafJson);
            return cornLeafJson;
        }
        return JSON.toJSONString("0");
    }

    /*根据TRT获取cornLeaf数据*/
    @RequestMapping("/corn/cornLeafTRT")
    public String getCornLeafByTRT(@RequestBody String strTRT) throws Exception {
        JSONObject jsonObject = JSON.parseObject(strTRT);
        Float TRT = new Tools().transSeparator2dot(jsonObject.getString("TRT"));

        List<CornLeaf> cornLeafList = cornService.getCornLeafByAttr(TRT, "TRT");
        if (cornLeafList != null) {
            String cornLeafJson = JSON.toJSONString(cornLeafList);
            System.out.println(cornLeafJson);
            return cornLeafJson;
        }
        return JSON.toJSONString("0");
    }

    /*根据DOY获取cornLeaf数据*/
    @RequestMapping("/corn/cornLeafDOY")
    public String getCornLeafByDOY(@RequestBody String strDOY) throws Exception {
        JSONObject jsonObject = JSON.parseObject(strDOY);
        Integer DOY = Integer.parseInt(jsonObject.getString("DOY"));

        List<CornLeaf> cornLeafList = cornService.getCornLeafByAttr(DOY, "DOY");
        if (cornLeafList != null) {
            String cornLeafJson = JSON.toJSONString(cornLeafList);
            System.out.println(cornLeafJson);
            return cornLeafJson;
        }
        return JSON.toJSONString("0");
    }

    /*根据DOY获取cornHeightAndChlo数据*/
    @RequestMapping("/corn/cornHeightAndChloDOY")
    public String getCornHeightAndChloByDOY(@RequestBody String strDOY) throws Exception {
        JSONObject jsonObject = JSON.parseObject(strDOY);
        Integer DOY = Integer.parseInt(jsonObject.getString("DOY"));

        List<CornHeightAndChlo> cornHeightAndChloList = cornService.getCornHandChByAttr(DOY, "DOY");
        if (cornHeightAndChloList != null) {
            String cornHeightAndChloJson = JSON.toJSONString(cornHeightAndChloList);
            System.out.println(cornHeightAndChloJson);
            return cornHeightAndChloJson;
        }
        return JSON.toJSONString("0");
    }

    /*获取cornYield所有数据*/
    @RequestMapping("/corn/cornYield")
    public String getCornYield() throws Exception {
        List<CornYield> cornYieldList = cornService.getAllCornYield();
        if (cornYieldList != null) {
            String cornYieldJson = JSON.toJSONString(cornYieldList);
            System.out.println(cornYieldJson);
            return cornYieldJson;
        }
        return JSON.toJSONString("0");
    }

    //文件上传相关部分-------------------------------------------------------------

    /*
     * 上传中一直存在的问题
     * 1.第一次上传成功后，再上传不能覆盖原来文件，会报错(已解决)
     * 2.写入数据库时，如写入1000条数据，写入500条时数据格式出错，事务不会回滚，导致再次重写时会报错主键重复
     * 此问题在于写入多条数据时，是一条一条插入，并不是一次插入*/
    /*上传模板文件并保存*/
    @RequestMapping("/templateUpload")
    public String templateUpload(@RequestParam("template") MultipartFile file) throws IOException {
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/file/fileTemplates/";
        fileUpload(path, file);
        return "success";
    }

    /*下载文件模板*/
    @RequestMapping("/templateDownload")
    public void templateDownload(HttpServletResponse httpServletResponse, String fileName) throws IOException {

        //String fileName = "template.xlsx";//根据前端的需求选择下载哪个模板文件
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/file/fileTemplates/";

        File templates = new File(path);
        if (!templates.exists()) {
            templates.mkdirs();
        }

        //设置下载文件头信息，防止文件乱码不可读
        File excelTemplate = new File(path + fileName);
        //httpServletResponse.setContentType("application/octet-stream;charset=UTF-8");
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setHeader("content-type", "application/octet-stream;charset=UTF-8");
        httpServletResponse.addHeader("Content-length", String.valueOf(excelTemplate.length()));

        httpServletResponse.setHeader("Content-Disposition", "attachment;filename=" +
                URLEncoder.encode(fileName.trim(), "UTF-8"));

        //输出
        BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(excelTemplate));
        OutputStream outputStream = httpServletResponse.getOutputStream();
        byte[] buff = new byte[10000];
        int i = 0;
        while (i != -1) {
            i = bufferedInputStream.read(buff);
            if (i != -1) {
                outputStream.write(buff, 0, i);
            }
        }
        bufferedInputStream.close();
        outputStream.flush();
        outputStream.close();
    }

    /*上传数据文件*/
    @RequestMapping(value = "/dataFileUpload")
    public String dataFileUpload(@RequestParam("dataFile") MultipartFile multipartFile) throws IOException {
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/file/dataFile/";
        fileUpload(path, multipartFile);
        return "success";
    }

    /*保存上传的数据文件到数据库
     * 前端提供要保持的是哪个文件
     * 对应调取service中的方法
     * */
    @RequestMapping("/addToDatabaseByFile")
    public String addToDatabaseByFile(@RequestBody String dataFileName) throws Exception {
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/file/dataFile/";
        String dataPath = path + dataFileName;
        if (dataFileName != null) {
            switch (dataFileName) {
                case "产量_R.xlsx":
                    if (cornService.saveCornYieldByFile(dataPath)) {
                        System.out.println("Add To Corn Yield Database By File Success");
                    }
                    break;
                case "叶面积仪数据统计_R.xlsx":
                    if (cornService.saveCornLeafByFile(dataPath)) {
                        System.out.println("Add To Corn Leaf Database By File Success");
                    }
                    break;
                case "株高和叶绿素_R.xlsx":
                    if (cornService.saveCornHeightAndChloByFile(dataPath)) {
                        System.out.println("Add To Corn Height And Chlo Database By File Success");
                    }
                    break;
            }
            return "success";
        }

        return "failed";
    }


    @RequestMapping("/addToDatabase")
    public String addToDatabase() {
        return "success";
    }

    public void fileUpload(String filePath, MultipartFile multipartFile) throws IOException {

        /*先进入到文件夹,文件夹不存在就创建*/
        File test = new File(filePath);
        if (!test.exists()) {
            test.mkdirs();
        }
        /*如果文件存在,先删除再保存*/
        File uploadFilePath = new File(filePath + multipartFile.getOriginalFilename());
        if (uploadFilePath.exists()) {
            uploadFilePath.delete();
        }
        multipartFile.transferTo(uploadFilePath);
    }
}

package com.gis.controller;

import com.alibaba.fastjson.JSON;
import com.gis.service.ClimaticService;
import com.gis.service.CornService;
import com.gis.service.FieldService;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.Objects;

/*数据文件上传下载相关功能*/
@Controller
public class FileController {
    @Resource
    private CornService cornService;
    @Resource
    private FieldService fieldService;
    @Resource
    private ClimaticService climaticService;

    @RequestMapping("dataUpload")
    @ResponseBody
    public String dataUpload(@Param("uploadFile") MultipartFile uploadFile) throws Exception {
        //判断文件是否为空
        if (uploadFile.getName().equals("") || uploadFile.getSize() <= 0)
            return JSON.toJSONString("0");

        //获取文件保存url,注意不是windows下文件路径
        String savePath = ResourceUtils.getURL("classpath:").getPath() + "static/src/file/dataFile/";
        File file = multipartFiletoFile(uploadFile);

        //保存文件
        String result = "0";
        if (saveFile(savePath, file))
            result = "1";
        else
            result = "0";

        //根据上传的数据文件更新
        if (addToDatabaseByFile(file.getName()))
            System.out.println("更新数据成功");
        else
            System.out.println("更新数据失败");

        //file是在项目根目录下临时生成的文件，需要删除
        if (file.delete())
            System.out.println("临时文件已删除");
        else
            System.out.println("临时文件删除失败");

        return JSON.toJSONString(result);
    }

    /*
     * 上传中一直存在的问题
     * 1.第一次上传成功后，再上传不能覆盖原来文件，会报错(已解决)
     * 2.写入数据库时，如写入1000条数据，写入500条时数据格式出错，事务不会回滚，导致再次重写时会报错主键重复
     * 此问题在于写入多条数据时，是一条一条插入，并不是一次插入，计划可以在发生错误时，执行一次删除操作，达到回滚的效果*/
    /*上传模板文件并保存*/
    @RequestMapping("/templateUpload")
    @ResponseBody
    public String templateUpload(@RequestParam("template") MultipartFile file) throws IOException {
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/src/file/fileTemplates/";
        //saveFile(path, file);
        return "success";
    }

    /*下载文件模板*/
    @RequestMapping("/templateDownload")
    public void templateDownload(HttpServletResponse httpServletResponse, String fileName) throws IOException {

        //String fileName = "template.xlsx";//根据前端的需求选择下载哪个模板文件
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/src/file/fileTemplates/";

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
    @ResponseBody
    public String dataFileUpload(@RequestParam("dataFile") MultipartFile multipartFile) throws IOException {
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/src/file/dataFile/";
        //saveFile(path, multipartFile);
        return "success";
    }

    /*保存上传的数据文件到数据库
     * 前端提供要保持的是哪个文件
     * 对应调取service中的方法
     * */
    public boolean addToDatabaseByFile(String dataFileName) throws Exception {
        String path = ResourceUtils.getURL("classpath:").getPath() + "static/src/file/dataFile/";
        String dataPath = path + dataFileName;
        if (dataFileName != null) {
            switch (dataFileName) {
                case "yield.xlsx":
                    if (cornService.saveCornYieldByFile(dataPath)) {
                        System.out.println("Add To Corn Yield Database By File Success");
                    }
                    break;
                case "lam.xlsx":
                    if (cornService.saveCornLeafByFile(dataPath)) {
                        System.out.println("Add To Corn Leaf Database By File Success");
                    }
                    break;
                case "chAndChl.xlsx":
                    if (cornService.saveCornHeightAndChloByFile(dataPath)) {
                        System.out.println("Add To Corn Height And Chlo Database By File Success");
                    }
                    break;
                case "lai.xlsx":
                    if (cornService.saveCornLAIByFile(dataPath)) {
                        System.out.println("Add To Corn LAI Database By File Success");
                    }
                    break;
                case "swc.xlsx":
                    if (fieldService.saveSWCByFile(dataPath)) {
                        System.out.println("Add To SWC Database By File Success");
                    }
                    break;
                case "vwc.xlsx":
                    if (fieldService.saveFieldWaterHoldByFile(dataPath)) {
                        System.out.println("Add To FieldWaterHold Database By File Success");
                    }
                    break;
                case "sws.xlsx":
                    if (climaticService.saveClimaticStationByFile(dataPath)) {
                        System.out.println("Add To ClimaticStation Database By File Success");
                    }
                    break;
                case "preAndIrr.xlsx":
                    if (climaticService.saveFieldPAIByFile(dataPath)) {
                        System.out.println("Add To FieldPAI Database By File Success");
                    }
                    break;
                default:
                    throw new Exception("Can't Find File With Name ---- " + dataFileName);
            }
            return true;
        }
        return false;
    }


    @RequestMapping("/addToDatabase")
    @ResponseBody
    public String addToDatabase() {
        return "success";
    }

    public File multipartFiletoFile(MultipartFile multipartFile) throws IOException {

        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));

        InputStream inputStream = multipartFile.getInputStream();
        OutputStream outputStream = new FileOutputStream(file);

        int byteRead = 0;
        byte[] buffer = new byte[4096];

        while ((byteRead = inputStream.read(buffer, 0, 4096)) != -1)
            outputStream.write(buffer, 0, byteRead);

        outputStream.close();
        inputStream.close();

        return file;
    }

    public boolean saveFile(String savePath, File file) throws IOException {
        //如果目标文件所在的文件夹未被创建，则需要先创建文件夹再创建文件。
        File targetDir = new File(savePath);

        //是否创建文件夹
        if (!targetDir.exists())
            return !targetDir.mkdirs();

        //创建文件
        File sfile = new File(savePath + file.getName());
        //覆盖旧文件
        if (sfile.createNewFile())
            return false;

        InputStream inputStream = new FileInputStream(file);
        OutputStream outputStream = new FileOutputStream(sfile);

        int byteRead = 0;
        byte[] buffer = new byte[4096];

        while ((byteRead = inputStream.read(buffer, 0, 4096)) != -1)
            outputStream.write(buffer, 0, byteRead);

        outputStream.flush();
        outputStream.close();
        inputStream.close();

        return true;
    }
}

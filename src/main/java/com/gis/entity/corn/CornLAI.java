package com.gis.entity.corn;

/**
 * Author:  SilentSherlock
 * Date: 2020/5/9
 * Time: 12:28
 */
public class CornLAI {

    private Integer DOY;//primary key
    private Integer TRT;
    private String NUM_1;
    private String NUM_2;//primary key
    private Integer NUM_3;
    private Float LAI;

    public Integer getDOY() {
        return DOY;
    }

    public void setDOY(Integer DOY) {
        this.DOY = DOY;
    }

    public Integer getTRT() {
        return TRT;
    }

    public void setTRT(Integer TRT) {
        this.TRT = TRT;
    }

    public String getNUM_1() {
        return NUM_1;
    }

    public void setNUM_1(String NUM_1) {
        this.NUM_1 = NUM_1;
    }

    public String getNUM_2() {
        return NUM_2;
    }

    public void setNUM_2(String NUM_2) {
        this.NUM_2 = NUM_2;
    }

    public Integer getNUM_3() {
        return NUM_3;
    }

    public void setNUM_3(Integer NUM_3) {
        this.NUM_3 = NUM_3;
    }

    public Float getLAI() {
        return LAI;
    }

    public void setLAI(Float LAI) {
        this.LAI = LAI;
    }
}

package com.gis.entity.climatic;

import java.util.Date;

/**
 * Date: 2020/6/9
 * Description: Field precipitation and Irrigation
 */
public class FieldPAI {

    private Integer DOY;//primary key
    private Integer TRT;//primary key
    private Integer precipitation;
    private Integer irrigation;
    private Date recordDate;

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

    public Integer getPrecipitation() {
        return precipitation;
    }

    public void setPrecipitation(Integer precipitation) {
        this.precipitation = precipitation;
    }

    public Integer getIrrigation() {
        return irrigation;
    }

    public void setIrrigation(Integer irrigation) {
        this.irrigation = irrigation;
    }

    public Date getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(Date recordDate) {
        this.recordDate = recordDate;
    }
}

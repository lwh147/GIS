package com.gis.dao.field;

import com.gis.entity.field.FieldWaterHold;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Date: 2020/5/14
 * Description: offer The field water hold data access operations with interface
 */
@Repository
public interface FieldWaterHoldDao {

    void save(FieldWaterHold fieldWaterHold) throws Exception;
    void deleteByPrimaryKey(String NUM_2) throws Exception;
    List<FieldWaterHold> getAll() throws Exception;
    List<FieldWaterHold> getByAttr(@Param("attrName") String attrName, @Param("attrValue") Object attrValue) throws Exception;
}

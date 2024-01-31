package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.DepartmentTestSamples.*;
import static com.mycompany.myapp.domain.FacilityTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DepartmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Department.class);
        Department department1 = getDepartmentSample1();
        Department department2 = new Department();
        assertThat(department1).isNotEqualTo(department2);

        department2.setId(department1.getId());
        assertThat(department1).isEqualTo(department2);

        department2 = getDepartmentSample2();
        assertThat(department1).isNotEqualTo(department2);
    }

    @Test
    void facilityTest() throws Exception {
        Department department = getDepartmentRandomSampleGenerator();
        Facility facilityBack = getFacilityRandomSampleGenerator();

        department.setFacility(facilityBack);
        assertThat(department.getFacility()).isEqualTo(facilityBack);

        department.facility(null);
        assertThat(department.getFacility()).isNull();
    }
}

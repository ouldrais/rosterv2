package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.DepartmentTestSamples.*;
import static com.mycompany.myapp.domain.PositionTestSamples.*;
import static com.mycompany.myapp.domain.ShiftDemandTestSamples.*;
import static com.mycompany.myapp.domain.ShiftTestSamples.*;
import static com.mycompany.myapp.domain.TaskTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShiftDemandTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShiftDemand.class);
        ShiftDemand shiftDemand1 = getShiftDemandSample1();
        ShiftDemand shiftDemand2 = new ShiftDemand();
        assertThat(shiftDemand1).isNotEqualTo(shiftDemand2);

        shiftDemand2.setId(shiftDemand1.getId());
        assertThat(shiftDemand1).isEqualTo(shiftDemand2);

        shiftDemand2 = getShiftDemandSample2();
        assertThat(shiftDemand1).isNotEqualTo(shiftDemand2);
    }

    @Test
    void shiftTest() throws Exception {
        ShiftDemand shiftDemand = getShiftDemandRandomSampleGenerator();
        Shift shiftBack = getShiftRandomSampleGenerator();

        shiftDemand.setShift(shiftBack);
        assertThat(shiftDemand.getShift()).isEqualTo(shiftBack);

        shiftDemand.shift(null);
        assertThat(shiftDemand.getShift()).isNull();
    }

    @Test
    void taskTest() throws Exception {
        ShiftDemand shiftDemand = getShiftDemandRandomSampleGenerator();
        Task taskBack = getTaskRandomSampleGenerator();

        shiftDemand.setTask(taskBack);
        assertThat(shiftDemand.getTask()).isEqualTo(taskBack);

        shiftDemand.task(null);
        assertThat(shiftDemand.getTask()).isNull();
    }

    @Test
    void positionTest() throws Exception {
        ShiftDemand shiftDemand = getShiftDemandRandomSampleGenerator();
        Position positionBack = getPositionRandomSampleGenerator();

        shiftDemand.setPosition(positionBack);
        assertThat(shiftDemand.getPosition()).isEqualTo(positionBack);

        shiftDemand.position(null);
        assertThat(shiftDemand.getPosition()).isNull();
    }

    @Test
    void departmentTest() throws Exception {
        ShiftDemand shiftDemand = getShiftDemandRandomSampleGenerator();
        Department departmentBack = getDepartmentRandomSampleGenerator();

        shiftDemand.setDepartment(departmentBack);
        assertThat(shiftDemand.getDepartment()).isEqualTo(departmentBack);

        shiftDemand.department(null);
        assertThat(shiftDemand.getDepartment()).isNull();
    }
}

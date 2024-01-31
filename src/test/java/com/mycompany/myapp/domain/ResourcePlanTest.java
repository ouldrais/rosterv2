package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.PositionTestSamples.*;
import static com.mycompany.myapp.domain.ResourcePlanTestSamples.*;
import static com.mycompany.myapp.domain.ResourceTestSamples.*;
import static com.mycompany.myapp.domain.ShiftTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResourcePlanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourcePlan.class);
        ResourcePlan resourcePlan1 = getResourcePlanSample1();
        ResourcePlan resourcePlan2 = new ResourcePlan();
        assertThat(resourcePlan1).isNotEqualTo(resourcePlan2);

        resourcePlan2.setId(resourcePlan1.getId());
        assertThat(resourcePlan1).isEqualTo(resourcePlan2);

        resourcePlan2 = getResourcePlanSample2();
        assertThat(resourcePlan1).isNotEqualTo(resourcePlan2);
    }

    @Test
    void resourceTest() throws Exception {
        ResourcePlan resourcePlan = getResourcePlanRandomSampleGenerator();
        Resource resourceBack = getResourceRandomSampleGenerator();

        resourcePlan.setResource(resourceBack);
        assertThat(resourcePlan.getResource()).isEqualTo(resourceBack);

        resourcePlan.resource(null);
        assertThat(resourcePlan.getResource()).isNull();
    }

    @Test
    void shiftTest() throws Exception {
        ResourcePlan resourcePlan = getResourcePlanRandomSampleGenerator();
        Shift shiftBack = getShiftRandomSampleGenerator();

        resourcePlan.setShift(shiftBack);
        assertThat(resourcePlan.getShift()).isEqualTo(shiftBack);

        resourcePlan.shift(null);
        assertThat(resourcePlan.getShift()).isNull();
    }

    @Test
    void positionTest() throws Exception {
        ResourcePlan resourcePlan = getResourcePlanRandomSampleGenerator();
        Position positionBack = getPositionRandomSampleGenerator();

        resourcePlan.setPosition(positionBack);
        assertThat(resourcePlan.getPosition()).isEqualTo(positionBack);

        resourcePlan.position(null);
        assertThat(resourcePlan.getPosition()).isNull();
    }
}

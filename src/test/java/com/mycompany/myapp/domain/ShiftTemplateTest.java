package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ShiftTemplateTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShiftTemplateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShiftTemplate.class);
        ShiftTemplate shiftTemplate1 = getShiftTemplateSample1();
        ShiftTemplate shiftTemplate2 = new ShiftTemplate();
        assertThat(shiftTemplate1).isNotEqualTo(shiftTemplate2);

        shiftTemplate2.setId(shiftTemplate1.getId());
        assertThat(shiftTemplate1).isEqualTo(shiftTemplate2);

        shiftTemplate2 = getShiftTemplateSample2();
        assertThat(shiftTemplate1).isNotEqualTo(shiftTemplate2);
    }
}

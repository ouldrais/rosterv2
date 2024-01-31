package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ShiftTypeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShiftTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShiftType.class);
        ShiftType shiftType1 = getShiftTypeSample1();
        ShiftType shiftType2 = new ShiftType();
        assertThat(shiftType1).isNotEqualTo(shiftType2);

        shiftType2.setId(shiftType1.getId());
        assertThat(shiftType1).isEqualTo(shiftType2);

        shiftType2 = getShiftTypeSample2();
        assertThat(shiftType1).isNotEqualTo(shiftType2);
    }
}

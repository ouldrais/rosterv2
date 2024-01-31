package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.RefCalendarTestSamples.*;
import static com.mycompany.myapp.domain.ShiftTypeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RefCalendarTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RefCalendar.class);
        RefCalendar refCalendar1 = getRefCalendarSample1();
        RefCalendar refCalendar2 = new RefCalendar();
        assertThat(refCalendar1).isNotEqualTo(refCalendar2);

        refCalendar2.setId(refCalendar1.getId());
        assertThat(refCalendar1).isEqualTo(refCalendar2);

        refCalendar2 = getRefCalendarSample2();
        assertThat(refCalendar1).isNotEqualTo(refCalendar2);
    }

    @Test
    void shiftTypeTest() throws Exception {
        RefCalendar refCalendar = getRefCalendarRandomSampleGenerator();
        ShiftType shiftTypeBack = getShiftTypeRandomSampleGenerator();

        refCalendar.setShiftType(shiftTypeBack);
        assertThat(refCalendar.getShiftType()).isEqualTo(shiftTypeBack);

        refCalendar.shiftType(null);
        assertThat(refCalendar.getShiftType()).isNull();
    }
}

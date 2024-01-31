package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ShiftTypeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ShiftType getShiftTypeSample1() {
        return new ShiftType().key(1L).id(1L);
    }

    public static ShiftType getShiftTypeSample2() {
        return new ShiftType().key(2L).id(2L);
    }

    public static ShiftType getShiftTypeRandomSampleGenerator() {
        return new ShiftType().key(longCount.incrementAndGet()).id(longCount.incrementAndGet());
    }
}

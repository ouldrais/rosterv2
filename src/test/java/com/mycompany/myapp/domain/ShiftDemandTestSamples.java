package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ShiftDemandTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ShiftDemand getShiftDemandSample1() {
        return new ShiftDemand().id(1L).count(1L);
    }

    public static ShiftDemand getShiftDemandSample2() {
        return new ShiftDemand().id(2L).count(2L);
    }

    public static ShiftDemand getShiftDemandRandomSampleGenerator() {
        return new ShiftDemand().id(longCount.incrementAndGet()).count(longCount.incrementAndGet());
    }
}

package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class FacilityTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Facility getFacilitySample1() {
        return new Facility().key(1L).id(1L);
    }

    public static Facility getFacilitySample2() {
        return new Facility().key(2L).id(2L);
    }

    public static Facility getFacilityRandomSampleGenerator() {
        return new Facility().key(longCount.incrementAndGet()).id(longCount.incrementAndGet());
    }
}

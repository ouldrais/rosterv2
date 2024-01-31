package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ShiftTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Shift getShiftSample1() {
        return new Shift().id(1L).key(1L).type("type1");
    }

    public static Shift getShiftSample2() {
        return new Shift().id(2L).key(2L).type("type2");
    }

    public static Shift getShiftRandomSampleGenerator() {
        return new Shift().id(longCount.incrementAndGet()).key(longCount.incrementAndGet()).type(UUID.randomUUID().toString());
    }
}

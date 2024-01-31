package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ShiftTemplateTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ShiftTemplate getShiftTemplateSample1() {
        return new ShiftTemplate().id(1L).key(1L).type("type1");
    }

    public static ShiftTemplate getShiftTemplateSample2() {
        return new ShiftTemplate().id(2L).key(2L).type("type2");
    }

    public static ShiftTemplate getShiftTemplateRandomSampleGenerator() {
        return new ShiftTemplate().id(longCount.incrementAndGet()).key(longCount.incrementAndGet()).type(UUID.randomUUID().toString());
    }
}

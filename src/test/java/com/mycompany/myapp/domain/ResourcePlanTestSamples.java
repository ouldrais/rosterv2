package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ResourcePlanTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ResourcePlan getResourcePlanSample1() {
        return new ResourcePlan().id(1L);
    }

    public static ResourcePlan getResourcePlanSample2() {
        return new ResourcePlan().id(2L);
    }

    public static ResourcePlan getResourcePlanRandomSampleGenerator() {
        return new ResourcePlan().id(longCount.incrementAndGet());
    }
}

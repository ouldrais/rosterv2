package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PositionRequirementTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PositionRequirement getPositionRequirementSample1() {
        return new PositionRequirement().id(1L).mandatoty("mandatoty1");
    }

    public static PositionRequirement getPositionRequirementSample2() {
        return new PositionRequirement().id(2L).mandatoty("mandatoty2");
    }

    public static PositionRequirement getPositionRequirementRandomSampleGenerator() {
        return new PositionRequirement().id(longCount.incrementAndGet()).mandatoty(UUID.randomUUID().toString());
    }
}

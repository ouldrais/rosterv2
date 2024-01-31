package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ResourceTrainingTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ResourceTraining getResourceTrainingSample1() {
        return new ResourceTraining().id(1L).status("status1").level("level1").trainer("trainer1");
    }

    public static ResourceTraining getResourceTrainingSample2() {
        return new ResourceTraining().id(2L).status("status2").level("level2").trainer("trainer2");
    }

    public static ResourceTraining getResourceTrainingRandomSampleGenerator() {
        return new ResourceTraining()
            .id(longCount.incrementAndGet())
            .status(UUID.randomUUID().toString())
            .level(UUID.randomUUID().toString())
            .trainer(UUID.randomUUID().toString());
    }
}

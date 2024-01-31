package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class RefRotationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static RefRotation getRefRotationSample1() {
        return new RefRotation().id(1L).order(1L);
    }

    public static RefRotation getRefRotationSample2() {
        return new RefRotation().id(2L).order(2L);
    }

    public static RefRotation getRefRotationRandomSampleGenerator() {
        return new RefRotation().id(longCount.incrementAndGet()).order(longCount.incrementAndGet());
    }
}

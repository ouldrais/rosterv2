package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TaskTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Task getTaskSample1() {
        return new Task().key(1L).id(1L).description("description1");
    }

    public static Task getTaskSample2() {
        return new Task().key(2L).id(2L).description("description2");
    }

    public static Task getTaskRandomSampleGenerator() {
        return new Task().key(longCount.incrementAndGet()).id(longCount.incrementAndGet()).description(UUID.randomUUID().toString());
    }
}

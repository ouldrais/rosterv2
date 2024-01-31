package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class RefCalendarTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static RefCalendar getRefCalendarSample1() {
        return new RefCalendar().key(1L).id(1L).status("status1");
    }

    public static RefCalendar getRefCalendarSample2() {
        return new RefCalendar().key(2L).id(2L).status("status2");
    }

    public static RefCalendar getRefCalendarRandomSampleGenerator() {
        return new RefCalendar().key(longCount.incrementAndGet()).id(longCount.incrementAndGet()).status(UUID.randomUUID().toString());
    }
}

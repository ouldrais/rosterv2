package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class RoleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Role getRoleSample1() {
        return new Role().key(1L).id(1L);
    }

    public static Role getRoleSample2() {
        return new Role().key(2L).id(2L);
    }

    public static Role getRoleRandomSampleGenerator() {
        return new Role().key(longCount.incrementAndGet()).id(longCount.incrementAndGet());
    }
}

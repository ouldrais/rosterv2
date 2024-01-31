package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ResourceRolesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ResourceRoles getResourceRolesSample1() {
        return new ResourceRoles().id(1L);
    }

    public static ResourceRoles getResourceRolesSample2() {
        return new ResourceRoles().id(2L);
    }

    public static ResourceRoles getResourceRolesRandomSampleGenerator() {
        return new ResourceRoles().id(longCount.incrementAndGet());
    }
}

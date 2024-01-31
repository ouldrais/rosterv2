package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class TeamPlanTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TeamPlan getTeamPlanSample1() {
        return new TeamPlan().id(1L);
    }

    public static TeamPlan getTeamPlanSample2() {
        return new TeamPlan().id(2L);
    }

    public static TeamPlan getTeamPlanRandomSampleGenerator() {
        return new TeamPlan().id(longCount.incrementAndGet());
    }
}

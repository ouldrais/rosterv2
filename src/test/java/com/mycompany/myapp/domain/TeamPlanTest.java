package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ShiftTestSamples.*;
import static com.mycompany.myapp.domain.TeamPlanTestSamples.*;
import static com.mycompany.myapp.domain.TeamTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TeamPlanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TeamPlan.class);
        TeamPlan teamPlan1 = getTeamPlanSample1();
        TeamPlan teamPlan2 = new TeamPlan();
        assertThat(teamPlan1).isNotEqualTo(teamPlan2);

        teamPlan2.setId(teamPlan1.getId());
        assertThat(teamPlan1).isEqualTo(teamPlan2);

        teamPlan2 = getTeamPlanSample2();
        assertThat(teamPlan1).isNotEqualTo(teamPlan2);
    }

    @Test
    void teamTest() throws Exception {
        TeamPlan teamPlan = getTeamPlanRandomSampleGenerator();
        Team teamBack = getTeamRandomSampleGenerator();

        teamPlan.setTeam(teamBack);
        assertThat(teamPlan.getTeam()).isEqualTo(teamBack);

        teamPlan.team(null);
        assertThat(teamPlan.getTeam()).isNull();
    }

    @Test
    void shiftTest() throws Exception {
        TeamPlan teamPlan = getTeamPlanRandomSampleGenerator();
        Shift shiftBack = getShiftRandomSampleGenerator();

        teamPlan.setShift(shiftBack);
        assertThat(teamPlan.getShift()).isEqualTo(shiftBack);

        teamPlan.shift(null);
        assertThat(teamPlan.getShift()).isNull();
    }
}

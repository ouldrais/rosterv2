package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ResourceRolesTestSamples.*;
import static com.mycompany.myapp.domain.ResourceTestSamples.*;
import static com.mycompany.myapp.domain.RoleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResourceRolesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourceRoles.class);
        ResourceRoles resourceRoles1 = getResourceRolesSample1();
        ResourceRoles resourceRoles2 = new ResourceRoles();
        assertThat(resourceRoles1).isNotEqualTo(resourceRoles2);

        resourceRoles2.setId(resourceRoles1.getId());
        assertThat(resourceRoles1).isEqualTo(resourceRoles2);

        resourceRoles2 = getResourceRolesSample2();
        assertThat(resourceRoles1).isNotEqualTo(resourceRoles2);
    }

    @Test
    void roleTest() throws Exception {
        ResourceRoles resourceRoles = getResourceRolesRandomSampleGenerator();
        Role roleBack = getRoleRandomSampleGenerator();

        resourceRoles.setRole(roleBack);
        assertThat(resourceRoles.getRole()).isEqualTo(roleBack);

        resourceRoles.role(null);
        assertThat(resourceRoles.getRole()).isNull();
    }

    @Test
    void resourceTest() throws Exception {
        ResourceRoles resourceRoles = getResourceRolesRandomSampleGenerator();
        Resource resourceBack = getResourceRandomSampleGenerator();

        resourceRoles.setResource(resourceBack);
        assertThat(resourceRoles.getResource()).isEqualTo(resourceBack);

        resourceRoles.resource(null);
        assertThat(resourceRoles.getResource()).isNull();
    }
}

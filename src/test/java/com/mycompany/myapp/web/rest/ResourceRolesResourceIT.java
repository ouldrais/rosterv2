package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ResourceRoles;
import com.mycompany.myapp.repository.ResourceRolesRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ResourceRolesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ResourceRolesResourceIT {

    private static final String ENTITY_API_URL = "/api/resource-roles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ResourceRolesRepository resourceRolesRepository;

    @Mock
    private ResourceRolesRepository resourceRolesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResourceRolesMockMvc;

    private ResourceRoles resourceRoles;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceRoles createEntity(EntityManager em) {
        ResourceRoles resourceRoles = new ResourceRoles();
        return resourceRoles;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceRoles createUpdatedEntity(EntityManager em) {
        ResourceRoles resourceRoles = new ResourceRoles();
        return resourceRoles;
    }

    @BeforeEach
    public void initTest() {
        resourceRoles = createEntity(em);
    }

    @Test
    @Transactional
    void createResourceRoles() throws Exception {
        int databaseSizeBeforeCreate = resourceRolesRepository.findAll().size();
        // Create the ResourceRoles
        restResourceRolesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourceRoles)))
            .andExpect(status().isCreated());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeCreate + 1);
        ResourceRoles testResourceRoles = resourceRolesList.get(resourceRolesList.size() - 1);
    }

    @Test
    @Transactional
    void createResourceRolesWithExistingId() throws Exception {
        // Create the ResourceRoles with an existing ID
        resourceRoles.setId(1L);

        int databaseSizeBeforeCreate = resourceRolesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResourceRolesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourceRoles)))
            .andExpect(status().isBadRequest());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllResourceRoles() throws Exception {
        // Initialize the database
        resourceRolesRepository.saveAndFlush(resourceRoles);

        // Get all the resourceRolesList
        restResourceRolesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourceRoles.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResourceRolesWithEagerRelationshipsIsEnabled() throws Exception {
        when(resourceRolesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResourceRolesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(resourceRolesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResourceRolesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(resourceRolesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResourceRolesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(resourceRolesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getResourceRoles() throws Exception {
        // Initialize the database
        resourceRolesRepository.saveAndFlush(resourceRoles);

        // Get the resourceRoles
        restResourceRolesMockMvc
            .perform(get(ENTITY_API_URL_ID, resourceRoles.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resourceRoles.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingResourceRoles() throws Exception {
        // Get the resourceRoles
        restResourceRolesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingResourceRoles() throws Exception {
        // Initialize the database
        resourceRolesRepository.saveAndFlush(resourceRoles);

        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();

        // Update the resourceRoles
        ResourceRoles updatedResourceRoles = resourceRolesRepository.findById(resourceRoles.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedResourceRoles are not directly saved in db
        em.detach(updatedResourceRoles);

        restResourceRolesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedResourceRoles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResourceRoles))
            )
            .andExpect(status().isOk());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
        ResourceRoles testResourceRoles = resourceRolesList.get(resourceRolesList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingResourceRoles() throws Exception {
        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();
        resourceRoles.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourceRolesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resourceRoles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resourceRoles))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResourceRoles() throws Exception {
        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();
        resourceRoles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceRolesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resourceRoles))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResourceRoles() throws Exception {
        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();
        resourceRoles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceRolesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourceRoles)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResourceRolesWithPatch() throws Exception {
        // Initialize the database
        resourceRolesRepository.saveAndFlush(resourceRoles);

        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();

        // Update the resourceRoles using partial update
        ResourceRoles partialUpdatedResourceRoles = new ResourceRoles();
        partialUpdatedResourceRoles.setId(resourceRoles.getId());

        restResourceRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResourceRoles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResourceRoles))
            )
            .andExpect(status().isOk());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
        ResourceRoles testResourceRoles = resourceRolesList.get(resourceRolesList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateResourceRolesWithPatch() throws Exception {
        // Initialize the database
        resourceRolesRepository.saveAndFlush(resourceRoles);

        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();

        // Update the resourceRoles using partial update
        ResourceRoles partialUpdatedResourceRoles = new ResourceRoles();
        partialUpdatedResourceRoles.setId(resourceRoles.getId());

        restResourceRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResourceRoles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResourceRoles))
            )
            .andExpect(status().isOk());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
        ResourceRoles testResourceRoles = resourceRolesList.get(resourceRolesList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingResourceRoles() throws Exception {
        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();
        resourceRoles.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourceRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resourceRoles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourceRoles))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResourceRoles() throws Exception {
        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();
        resourceRoles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceRolesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourceRoles))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResourceRoles() throws Exception {
        int databaseSizeBeforeUpdate = resourceRolesRepository.findAll().size();
        resourceRoles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceRolesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(resourceRoles))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ResourceRoles in the database
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResourceRoles() throws Exception {
        // Initialize the database
        resourceRolesRepository.saveAndFlush(resourceRoles);

        int databaseSizeBeforeDelete = resourceRolesRepository.findAll().size();

        // Delete the resourceRoles
        restResourceRolesMockMvc
            .perform(delete(ENTITY_API_URL_ID, resourceRoles.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResourceRoles> resourceRolesList = resourceRolesRepository.findAll();
        assertThat(resourceRolesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

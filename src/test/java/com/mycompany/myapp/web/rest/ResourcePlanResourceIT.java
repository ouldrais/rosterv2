package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ResourcePlan;
import com.mycompany.myapp.repository.ResourcePlanRepository;
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
 * Integration tests for the {@link ResourcePlanResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ResourcePlanResourceIT {

    private static final Boolean DEFAULT_AVAILABILITY = false;
    private static final Boolean UPDATED_AVAILABILITY = true;

    private static final String ENTITY_API_URL = "/api/resource-plans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ResourcePlanRepository resourcePlanRepository;

    @Mock
    private ResourcePlanRepository resourcePlanRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResourcePlanMockMvc;

    private ResourcePlan resourcePlan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourcePlan createEntity(EntityManager em) {
        ResourcePlan resourcePlan = new ResourcePlan().availability(DEFAULT_AVAILABILITY);
        return resourcePlan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourcePlan createUpdatedEntity(EntityManager em) {
        ResourcePlan resourcePlan = new ResourcePlan().availability(UPDATED_AVAILABILITY);
        return resourcePlan;
    }

    @BeforeEach
    public void initTest() {
        resourcePlan = createEntity(em);
    }

    @Test
    @Transactional
    void createResourcePlan() throws Exception {
        int databaseSizeBeforeCreate = resourcePlanRepository.findAll().size();
        // Create the ResourcePlan
        restResourcePlanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourcePlan)))
            .andExpect(status().isCreated());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeCreate + 1);
        ResourcePlan testResourcePlan = resourcePlanList.get(resourcePlanList.size() - 1);
        assertThat(testResourcePlan.getAvailability()).isEqualTo(DEFAULT_AVAILABILITY);
    }

    @Test
    @Transactional
    void createResourcePlanWithExistingId() throws Exception {
        // Create the ResourcePlan with an existing ID
        resourcePlan.setId(1L);

        int databaseSizeBeforeCreate = resourcePlanRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResourcePlanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourcePlan)))
            .andExpect(status().isBadRequest());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllResourcePlans() throws Exception {
        // Initialize the database
        resourcePlanRepository.saveAndFlush(resourcePlan);

        // Get all the resourcePlanList
        restResourcePlanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourcePlan.getId().intValue())))
            .andExpect(jsonPath("$.[*].availability").value(hasItem(DEFAULT_AVAILABILITY.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResourcePlansWithEagerRelationshipsIsEnabled() throws Exception {
        when(resourcePlanRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResourcePlanMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(resourcePlanRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResourcePlansWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(resourcePlanRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResourcePlanMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(resourcePlanRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getResourcePlan() throws Exception {
        // Initialize the database
        resourcePlanRepository.saveAndFlush(resourcePlan);

        // Get the resourcePlan
        restResourcePlanMockMvc
            .perform(get(ENTITY_API_URL_ID, resourcePlan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resourcePlan.getId().intValue()))
            .andExpect(jsonPath("$.availability").value(DEFAULT_AVAILABILITY.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingResourcePlan() throws Exception {
        // Get the resourcePlan
        restResourcePlanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingResourcePlan() throws Exception {
        // Initialize the database
        resourcePlanRepository.saveAndFlush(resourcePlan);

        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();

        // Update the resourcePlan
        ResourcePlan updatedResourcePlan = resourcePlanRepository.findById(resourcePlan.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedResourcePlan are not directly saved in db
        em.detach(updatedResourcePlan);
        updatedResourcePlan.availability(UPDATED_AVAILABILITY);

        restResourcePlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedResourcePlan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResourcePlan))
            )
            .andExpect(status().isOk());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
        ResourcePlan testResourcePlan = resourcePlanList.get(resourcePlanList.size() - 1);
        assertThat(testResourcePlan.getAvailability()).isEqualTo(UPDATED_AVAILABILITY);
    }

    @Test
    @Transactional
    void putNonExistingResourcePlan() throws Exception {
        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();
        resourcePlan.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourcePlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resourcePlan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resourcePlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResourcePlan() throws Exception {
        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();
        resourcePlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcePlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resourcePlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResourcePlan() throws Exception {
        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();
        resourcePlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcePlanMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourcePlan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResourcePlanWithPatch() throws Exception {
        // Initialize the database
        resourcePlanRepository.saveAndFlush(resourcePlan);

        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();

        // Update the resourcePlan using partial update
        ResourcePlan partialUpdatedResourcePlan = new ResourcePlan();
        partialUpdatedResourcePlan.setId(resourcePlan.getId());

        restResourcePlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResourcePlan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResourcePlan))
            )
            .andExpect(status().isOk());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
        ResourcePlan testResourcePlan = resourcePlanList.get(resourcePlanList.size() - 1);
        assertThat(testResourcePlan.getAvailability()).isEqualTo(DEFAULT_AVAILABILITY);
    }

    @Test
    @Transactional
    void fullUpdateResourcePlanWithPatch() throws Exception {
        // Initialize the database
        resourcePlanRepository.saveAndFlush(resourcePlan);

        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();

        // Update the resourcePlan using partial update
        ResourcePlan partialUpdatedResourcePlan = new ResourcePlan();
        partialUpdatedResourcePlan.setId(resourcePlan.getId());

        partialUpdatedResourcePlan.availability(UPDATED_AVAILABILITY);

        restResourcePlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResourcePlan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResourcePlan))
            )
            .andExpect(status().isOk());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
        ResourcePlan testResourcePlan = resourcePlanList.get(resourcePlanList.size() - 1);
        assertThat(testResourcePlan.getAvailability()).isEqualTo(UPDATED_AVAILABILITY);
    }

    @Test
    @Transactional
    void patchNonExistingResourcePlan() throws Exception {
        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();
        resourcePlan.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourcePlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resourcePlan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourcePlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResourcePlan() throws Exception {
        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();
        resourcePlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcePlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourcePlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResourcePlan() throws Exception {
        int databaseSizeBeforeUpdate = resourcePlanRepository.findAll().size();
        resourcePlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourcePlanMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(resourcePlan))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ResourcePlan in the database
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResourcePlan() throws Exception {
        // Initialize the database
        resourcePlanRepository.saveAndFlush(resourcePlan);

        int databaseSizeBeforeDelete = resourcePlanRepository.findAll().size();

        // Delete the resourcePlan
        restResourcePlanMockMvc
            .perform(delete(ENTITY_API_URL_ID, resourcePlan.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResourcePlan> resourcePlanList = resourcePlanRepository.findAll();
        assertThat(resourcePlanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ResourceTraining;
import com.mycompany.myapp.repository.ResourceTrainingRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ResourceTrainingResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ResourceTrainingResourceIT {

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_LEVEL = "AAAAAAAAAA";
    private static final String UPDATED_LEVEL = "BBBBBBBBBB";

    private static final String DEFAULT_TRAINER = "AAAAAAAAAA";
    private static final String UPDATED_TRAINER = "BBBBBBBBBB";

    private static final Instant DEFAULT_ACTIVE_FROM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACTIVE_FROM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_ACTIVETO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACTIVETO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/resource-trainings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ResourceTrainingRepository resourceTrainingRepository;

    @Mock
    private ResourceTrainingRepository resourceTrainingRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResourceTrainingMockMvc;

    private ResourceTraining resourceTraining;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceTraining createEntity(EntityManager em) {
        ResourceTraining resourceTraining = new ResourceTraining()
            .status(DEFAULT_STATUS)
            .level(DEFAULT_LEVEL)
            .trainer(DEFAULT_TRAINER)
            .activeFrom(DEFAULT_ACTIVE_FROM)
            .activeto(DEFAULT_ACTIVETO);
        return resourceTraining;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceTraining createUpdatedEntity(EntityManager em) {
        ResourceTraining resourceTraining = new ResourceTraining()
            .status(UPDATED_STATUS)
            .level(UPDATED_LEVEL)
            .trainer(UPDATED_TRAINER)
            .activeFrom(UPDATED_ACTIVE_FROM)
            .activeto(UPDATED_ACTIVETO);
        return resourceTraining;
    }

    @BeforeEach
    public void initTest() {
        resourceTraining = createEntity(em);
    }

    @Test
    @Transactional
    void createResourceTraining() throws Exception {
        int databaseSizeBeforeCreate = resourceTrainingRepository.findAll().size();
        // Create the ResourceTraining
        restResourceTrainingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isCreated());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeCreate + 1);
        ResourceTraining testResourceTraining = resourceTrainingList.get(resourceTrainingList.size() - 1);
        assertThat(testResourceTraining.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testResourceTraining.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testResourceTraining.getTrainer()).isEqualTo(DEFAULT_TRAINER);
        assertThat(testResourceTraining.getActiveFrom()).isEqualTo(DEFAULT_ACTIVE_FROM);
        assertThat(testResourceTraining.getActiveto()).isEqualTo(DEFAULT_ACTIVETO);
    }

    @Test
    @Transactional
    void createResourceTrainingWithExistingId() throws Exception {
        // Create the ResourceTraining with an existing ID
        resourceTraining.setId(1L);

        int databaseSizeBeforeCreate = resourceTrainingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResourceTrainingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllResourceTrainings() throws Exception {
        // Initialize the database
        resourceTrainingRepository.saveAndFlush(resourceTraining);

        // Get all the resourceTrainingList
        restResourceTrainingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourceTraining.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL)))
            .andExpect(jsonPath("$.[*].trainer").value(hasItem(DEFAULT_TRAINER)))
            .andExpect(jsonPath("$.[*].activeFrom").value(hasItem(DEFAULT_ACTIVE_FROM.toString())))
            .andExpect(jsonPath("$.[*].activeto").value(hasItem(DEFAULT_ACTIVETO.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResourceTrainingsWithEagerRelationshipsIsEnabled() throws Exception {
        when(resourceTrainingRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResourceTrainingMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(resourceTrainingRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResourceTrainingsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(resourceTrainingRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResourceTrainingMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(resourceTrainingRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getResourceTraining() throws Exception {
        // Initialize the database
        resourceTrainingRepository.saveAndFlush(resourceTraining);

        // Get the resourceTraining
        restResourceTrainingMockMvc
            .perform(get(ENTITY_API_URL_ID, resourceTraining.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resourceTraining.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL))
            .andExpect(jsonPath("$.trainer").value(DEFAULT_TRAINER))
            .andExpect(jsonPath("$.activeFrom").value(DEFAULT_ACTIVE_FROM.toString()))
            .andExpect(jsonPath("$.activeto").value(DEFAULT_ACTIVETO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingResourceTraining() throws Exception {
        // Get the resourceTraining
        restResourceTrainingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingResourceTraining() throws Exception {
        // Initialize the database
        resourceTrainingRepository.saveAndFlush(resourceTraining);

        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();

        // Update the resourceTraining
        ResourceTraining updatedResourceTraining = resourceTrainingRepository.findById(resourceTraining.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedResourceTraining are not directly saved in db
        em.detach(updatedResourceTraining);
        updatedResourceTraining
            .status(UPDATED_STATUS)
            .level(UPDATED_LEVEL)
            .trainer(UPDATED_TRAINER)
            .activeFrom(UPDATED_ACTIVE_FROM)
            .activeto(UPDATED_ACTIVETO);

        restResourceTrainingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedResourceTraining.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResourceTraining))
            )
            .andExpect(status().isOk());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
        ResourceTraining testResourceTraining = resourceTrainingList.get(resourceTrainingList.size() - 1);
        assertThat(testResourceTraining.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testResourceTraining.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testResourceTraining.getTrainer()).isEqualTo(UPDATED_TRAINER);
        assertThat(testResourceTraining.getActiveFrom()).isEqualTo(UPDATED_ACTIVE_FROM);
        assertThat(testResourceTraining.getActiveto()).isEqualTo(UPDATED_ACTIVETO);
    }

    @Test
    @Transactional
    void putNonExistingResourceTraining() throws Exception {
        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();
        resourceTraining.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourceTrainingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resourceTraining.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResourceTraining() throws Exception {
        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();
        resourceTraining.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceTrainingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResourceTraining() throws Exception {
        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();
        resourceTraining.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceTrainingMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResourceTrainingWithPatch() throws Exception {
        // Initialize the database
        resourceTrainingRepository.saveAndFlush(resourceTraining);

        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();

        // Update the resourceTraining using partial update
        ResourceTraining partialUpdatedResourceTraining = new ResourceTraining();
        partialUpdatedResourceTraining.setId(resourceTraining.getId());

        partialUpdatedResourceTraining.level(UPDATED_LEVEL).activeFrom(UPDATED_ACTIVE_FROM).activeto(UPDATED_ACTIVETO);

        restResourceTrainingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResourceTraining.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResourceTraining))
            )
            .andExpect(status().isOk());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
        ResourceTraining testResourceTraining = resourceTrainingList.get(resourceTrainingList.size() - 1);
        assertThat(testResourceTraining.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testResourceTraining.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testResourceTraining.getTrainer()).isEqualTo(DEFAULT_TRAINER);
        assertThat(testResourceTraining.getActiveFrom()).isEqualTo(UPDATED_ACTIVE_FROM);
        assertThat(testResourceTraining.getActiveto()).isEqualTo(UPDATED_ACTIVETO);
    }

    @Test
    @Transactional
    void fullUpdateResourceTrainingWithPatch() throws Exception {
        // Initialize the database
        resourceTrainingRepository.saveAndFlush(resourceTraining);

        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();

        // Update the resourceTraining using partial update
        ResourceTraining partialUpdatedResourceTraining = new ResourceTraining();
        partialUpdatedResourceTraining.setId(resourceTraining.getId());

        partialUpdatedResourceTraining
            .status(UPDATED_STATUS)
            .level(UPDATED_LEVEL)
            .trainer(UPDATED_TRAINER)
            .activeFrom(UPDATED_ACTIVE_FROM)
            .activeto(UPDATED_ACTIVETO);

        restResourceTrainingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResourceTraining.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResourceTraining))
            )
            .andExpect(status().isOk());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
        ResourceTraining testResourceTraining = resourceTrainingList.get(resourceTrainingList.size() - 1);
        assertThat(testResourceTraining.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testResourceTraining.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testResourceTraining.getTrainer()).isEqualTo(UPDATED_TRAINER);
        assertThat(testResourceTraining.getActiveFrom()).isEqualTo(UPDATED_ACTIVE_FROM);
        assertThat(testResourceTraining.getActiveto()).isEqualTo(UPDATED_ACTIVETO);
    }

    @Test
    @Transactional
    void patchNonExistingResourceTraining() throws Exception {
        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();
        resourceTraining.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourceTrainingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resourceTraining.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResourceTraining() throws Exception {
        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();
        resourceTraining.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceTrainingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isBadRequest());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResourceTraining() throws Exception {
        int databaseSizeBeforeUpdate = resourceTrainingRepository.findAll().size();
        resourceTraining.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResourceTrainingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resourceTraining))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ResourceTraining in the database
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResourceTraining() throws Exception {
        // Initialize the database
        resourceTrainingRepository.saveAndFlush(resourceTraining);

        int databaseSizeBeforeDelete = resourceTrainingRepository.findAll().size();

        // Delete the resourceTraining
        restResourceTrainingMockMvc
            .perform(delete(ENTITY_API_URL_ID, resourceTraining.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResourceTraining> resourceTrainingList = resourceTrainingRepository.findAll();
        assertThat(resourceTrainingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

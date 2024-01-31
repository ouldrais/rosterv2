package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.RefRotation;
import com.mycompany.myapp.repository.RefRotationRepository;
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
 * Integration tests for the {@link RefRotationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RefRotationResourceIT {

    private static final Long DEFAULT_ORDER = 1L;
    private static final Long UPDATED_ORDER = 2L;

    private static final String ENTITY_API_URL = "/api/ref-rotations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RefRotationRepository refRotationRepository;

    @Mock
    private RefRotationRepository refRotationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRefRotationMockMvc;

    private RefRotation refRotation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RefRotation createEntity(EntityManager em) {
        RefRotation refRotation = new RefRotation().order(DEFAULT_ORDER);
        return refRotation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RefRotation createUpdatedEntity(EntityManager em) {
        RefRotation refRotation = new RefRotation().order(UPDATED_ORDER);
        return refRotation;
    }

    @BeforeEach
    public void initTest() {
        refRotation = createEntity(em);
    }

    @Test
    @Transactional
    void createRefRotation() throws Exception {
        int databaseSizeBeforeCreate = refRotationRepository.findAll().size();
        // Create the RefRotation
        restRefRotationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refRotation)))
            .andExpect(status().isCreated());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeCreate + 1);
        RefRotation testRefRotation = refRotationList.get(refRotationList.size() - 1);
        assertThat(testRefRotation.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void createRefRotationWithExistingId() throws Exception {
        // Create the RefRotation with an existing ID
        refRotation.setId(1L);

        int databaseSizeBeforeCreate = refRotationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRefRotationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refRotation)))
            .andExpect(status().isBadRequest());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRefRotations() throws Exception {
        // Initialize the database
        refRotationRepository.saveAndFlush(refRotation);

        // Get all the refRotationList
        restRefRotationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(refRotation.getId().intValue())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER.intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRefRotationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(refRotationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRefRotationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(refRotationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRefRotationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(refRotationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRefRotationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(refRotationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRefRotation() throws Exception {
        // Initialize the database
        refRotationRepository.saveAndFlush(refRotation);

        // Get the refRotation
        restRefRotationMockMvc
            .perform(get(ENTITY_API_URL_ID, refRotation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(refRotation.getId().intValue()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingRefRotation() throws Exception {
        // Get the refRotation
        restRefRotationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRefRotation() throws Exception {
        // Initialize the database
        refRotationRepository.saveAndFlush(refRotation);

        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();

        // Update the refRotation
        RefRotation updatedRefRotation = refRotationRepository.findById(refRotation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRefRotation are not directly saved in db
        em.detach(updatedRefRotation);
        updatedRefRotation.order(UPDATED_ORDER);

        restRefRotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRefRotation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRefRotation))
            )
            .andExpect(status().isOk());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
        RefRotation testRefRotation = refRotationList.get(refRotationList.size() - 1);
        assertThat(testRefRotation.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingRefRotation() throws Exception {
        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();
        refRotation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefRotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, refRotation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refRotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRefRotation() throws Exception {
        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();
        refRotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefRotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refRotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRefRotation() throws Exception {
        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();
        refRotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefRotationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refRotation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRefRotationWithPatch() throws Exception {
        // Initialize the database
        refRotationRepository.saveAndFlush(refRotation);

        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();

        // Update the refRotation using partial update
        RefRotation partialUpdatedRefRotation = new RefRotation();
        partialUpdatedRefRotation.setId(refRotation.getId());

        partialUpdatedRefRotation.order(UPDATED_ORDER);

        restRefRotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefRotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefRotation))
            )
            .andExpect(status().isOk());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
        RefRotation testRefRotation = refRotationList.get(refRotationList.size() - 1);
        assertThat(testRefRotation.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateRefRotationWithPatch() throws Exception {
        // Initialize the database
        refRotationRepository.saveAndFlush(refRotation);

        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();

        // Update the refRotation using partial update
        RefRotation partialUpdatedRefRotation = new RefRotation();
        partialUpdatedRefRotation.setId(refRotation.getId());

        partialUpdatedRefRotation.order(UPDATED_ORDER);

        restRefRotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefRotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefRotation))
            )
            .andExpect(status().isOk());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
        RefRotation testRefRotation = refRotationList.get(refRotationList.size() - 1);
        assertThat(testRefRotation.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingRefRotation() throws Exception {
        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();
        refRotation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefRotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, refRotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refRotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRefRotation() throws Exception {
        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();
        refRotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefRotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refRotation))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRefRotation() throws Exception {
        int databaseSizeBeforeUpdate = refRotationRepository.findAll().size();
        refRotation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefRotationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(refRotation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RefRotation in the database
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRefRotation() throws Exception {
        // Initialize the database
        refRotationRepository.saveAndFlush(refRotation);

        int databaseSizeBeforeDelete = refRotationRepository.findAll().size();

        // Delete the refRotation
        restRefRotationMockMvc
            .perform(delete(ENTITY_API_URL_ID, refRotation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RefRotation> refRotationList = refRotationRepository.findAll();
        assertThat(refRotationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PositionRequirement;
import com.mycompany.myapp.repository.PositionRequirementRepository;
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
 * Integration tests for the {@link PositionRequirementResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PositionRequirementResourceIT {

    private static final String DEFAULT_MANDATOTY = "AAAAAAAAAA";
    private static final String UPDATED_MANDATOTY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/position-requirements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PositionRequirementRepository positionRequirementRepository;

    @Mock
    private PositionRequirementRepository positionRequirementRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPositionRequirementMockMvc;

    private PositionRequirement positionRequirement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PositionRequirement createEntity(EntityManager em) {
        PositionRequirement positionRequirement = new PositionRequirement().mandatoty(DEFAULT_MANDATOTY);
        return positionRequirement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PositionRequirement createUpdatedEntity(EntityManager em) {
        PositionRequirement positionRequirement = new PositionRequirement().mandatoty(UPDATED_MANDATOTY);
        return positionRequirement;
    }

    @BeforeEach
    public void initTest() {
        positionRequirement = createEntity(em);
    }

    @Test
    @Transactional
    void createPositionRequirement() throws Exception {
        int databaseSizeBeforeCreate = positionRequirementRepository.findAll().size();
        // Create the PositionRequirement
        restPositionRequirementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isCreated());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeCreate + 1);
        PositionRequirement testPositionRequirement = positionRequirementList.get(positionRequirementList.size() - 1);
        assertThat(testPositionRequirement.getMandatoty()).isEqualTo(DEFAULT_MANDATOTY);
    }

    @Test
    @Transactional
    void createPositionRequirementWithExistingId() throws Exception {
        // Create the PositionRequirement with an existing ID
        positionRequirement.setId(1L);

        int databaseSizeBeforeCreate = positionRequirementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPositionRequirementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPositionRequirements() throws Exception {
        // Initialize the database
        positionRequirementRepository.saveAndFlush(positionRequirement);

        // Get all the positionRequirementList
        restPositionRequirementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(positionRequirement.getId().intValue())))
            .andExpect(jsonPath("$.[*].mandatoty").value(hasItem(DEFAULT_MANDATOTY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPositionRequirementsWithEagerRelationshipsIsEnabled() throws Exception {
        when(positionRequirementRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPositionRequirementMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(positionRequirementRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPositionRequirementsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(positionRequirementRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPositionRequirementMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(positionRequirementRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPositionRequirement() throws Exception {
        // Initialize the database
        positionRequirementRepository.saveAndFlush(positionRequirement);

        // Get the positionRequirement
        restPositionRequirementMockMvc
            .perform(get(ENTITY_API_URL_ID, positionRequirement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(positionRequirement.getId().intValue()))
            .andExpect(jsonPath("$.mandatoty").value(DEFAULT_MANDATOTY));
    }

    @Test
    @Transactional
    void getNonExistingPositionRequirement() throws Exception {
        // Get the positionRequirement
        restPositionRequirementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPositionRequirement() throws Exception {
        // Initialize the database
        positionRequirementRepository.saveAndFlush(positionRequirement);

        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();

        // Update the positionRequirement
        PositionRequirement updatedPositionRequirement = positionRequirementRepository.findById(positionRequirement.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPositionRequirement are not directly saved in db
        em.detach(updatedPositionRequirement);
        updatedPositionRequirement.mandatoty(UPDATED_MANDATOTY);

        restPositionRequirementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPositionRequirement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPositionRequirement))
            )
            .andExpect(status().isOk());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
        PositionRequirement testPositionRequirement = positionRequirementList.get(positionRequirementList.size() - 1);
        assertThat(testPositionRequirement.getMandatoty()).isEqualTo(UPDATED_MANDATOTY);
    }

    @Test
    @Transactional
    void putNonExistingPositionRequirement() throws Exception {
        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();
        positionRequirement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPositionRequirementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, positionRequirement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPositionRequirement() throws Exception {
        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();
        positionRequirement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPositionRequirementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPositionRequirement() throws Exception {
        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();
        positionRequirement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPositionRequirementMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePositionRequirementWithPatch() throws Exception {
        // Initialize the database
        positionRequirementRepository.saveAndFlush(positionRequirement);

        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();

        // Update the positionRequirement using partial update
        PositionRequirement partialUpdatedPositionRequirement = new PositionRequirement();
        partialUpdatedPositionRequirement.setId(positionRequirement.getId());

        partialUpdatedPositionRequirement.mandatoty(UPDATED_MANDATOTY);

        restPositionRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPositionRequirement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPositionRequirement))
            )
            .andExpect(status().isOk());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
        PositionRequirement testPositionRequirement = positionRequirementList.get(positionRequirementList.size() - 1);
        assertThat(testPositionRequirement.getMandatoty()).isEqualTo(UPDATED_MANDATOTY);
    }

    @Test
    @Transactional
    void fullUpdatePositionRequirementWithPatch() throws Exception {
        // Initialize the database
        positionRequirementRepository.saveAndFlush(positionRequirement);

        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();

        // Update the positionRequirement using partial update
        PositionRequirement partialUpdatedPositionRequirement = new PositionRequirement();
        partialUpdatedPositionRequirement.setId(positionRequirement.getId());

        partialUpdatedPositionRequirement.mandatoty(UPDATED_MANDATOTY);

        restPositionRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPositionRequirement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPositionRequirement))
            )
            .andExpect(status().isOk());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
        PositionRequirement testPositionRequirement = positionRequirementList.get(positionRequirementList.size() - 1);
        assertThat(testPositionRequirement.getMandatoty()).isEqualTo(UPDATED_MANDATOTY);
    }

    @Test
    @Transactional
    void patchNonExistingPositionRequirement() throws Exception {
        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();
        positionRequirement.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPositionRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, positionRequirement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPositionRequirement() throws Exception {
        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();
        positionRequirement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPositionRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPositionRequirement() throws Exception {
        int databaseSizeBeforeUpdate = positionRequirementRepository.findAll().size();
        positionRequirement.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPositionRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(positionRequirement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PositionRequirement in the database
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePositionRequirement() throws Exception {
        // Initialize the database
        positionRequirementRepository.saveAndFlush(positionRequirement);

        int databaseSizeBeforeDelete = positionRequirementRepository.findAll().size();

        // Delete the positionRequirement
        restPositionRequirementMockMvc
            .perform(delete(ENTITY_API_URL_ID, positionRequirement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PositionRequirement> positionRequirementList = positionRequirementRepository.findAll();
        assertThat(positionRequirementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

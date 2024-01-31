package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ShiftDemand;
import com.mycompany.myapp.repository.ShiftDemandRepository;
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
 * Integration tests for the {@link ShiftDemandResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ShiftDemandResourceIT {

    private static final Long DEFAULT_COUNT = 1L;
    private static final Long UPDATED_COUNT = 2L;

    private static final String ENTITY_API_URL = "/api/shift-demands";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShiftDemandRepository shiftDemandRepository;

    @Mock
    private ShiftDemandRepository shiftDemandRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShiftDemandMockMvc;

    private ShiftDemand shiftDemand;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShiftDemand createEntity(EntityManager em) {
        ShiftDemand shiftDemand = new ShiftDemand().count(DEFAULT_COUNT);
        return shiftDemand;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShiftDemand createUpdatedEntity(EntityManager em) {
        ShiftDemand shiftDemand = new ShiftDemand().count(UPDATED_COUNT);
        return shiftDemand;
    }

    @BeforeEach
    public void initTest() {
        shiftDemand = createEntity(em);
    }

    @Test
    @Transactional
    void createShiftDemand() throws Exception {
        int databaseSizeBeforeCreate = shiftDemandRepository.findAll().size();
        // Create the ShiftDemand
        restShiftDemandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftDemand)))
            .andExpect(status().isCreated());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeCreate + 1);
        ShiftDemand testShiftDemand = shiftDemandList.get(shiftDemandList.size() - 1);
        assertThat(testShiftDemand.getCount()).isEqualTo(DEFAULT_COUNT);
    }

    @Test
    @Transactional
    void createShiftDemandWithExistingId() throws Exception {
        // Create the ShiftDemand with an existing ID
        shiftDemand.setId(1L);

        int databaseSizeBeforeCreate = shiftDemandRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShiftDemandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftDemand)))
            .andExpect(status().isBadRequest());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShiftDemands() throws Exception {
        // Initialize the database
        shiftDemandRepository.saveAndFlush(shiftDemand);

        // Get all the shiftDemandList
        restShiftDemandMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shiftDemand.getId().intValue())))
            .andExpect(jsonPath("$.[*].count").value(hasItem(DEFAULT_COUNT.intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllShiftDemandsWithEagerRelationshipsIsEnabled() throws Exception {
        when(shiftDemandRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restShiftDemandMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(shiftDemandRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllShiftDemandsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(shiftDemandRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restShiftDemandMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(shiftDemandRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getShiftDemand() throws Exception {
        // Initialize the database
        shiftDemandRepository.saveAndFlush(shiftDemand);

        // Get the shiftDemand
        restShiftDemandMockMvc
            .perform(get(ENTITY_API_URL_ID, shiftDemand.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shiftDemand.getId().intValue()))
            .andExpect(jsonPath("$.count").value(DEFAULT_COUNT.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingShiftDemand() throws Exception {
        // Get the shiftDemand
        restShiftDemandMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShiftDemand() throws Exception {
        // Initialize the database
        shiftDemandRepository.saveAndFlush(shiftDemand);

        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();

        // Update the shiftDemand
        ShiftDemand updatedShiftDemand = shiftDemandRepository.findById(shiftDemand.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedShiftDemand are not directly saved in db
        em.detach(updatedShiftDemand);
        updatedShiftDemand.count(UPDATED_COUNT);

        restShiftDemandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShiftDemand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShiftDemand))
            )
            .andExpect(status().isOk());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
        ShiftDemand testShiftDemand = shiftDemandList.get(shiftDemandList.size() - 1);
        assertThat(testShiftDemand.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void putNonExistingShiftDemand() throws Exception {
        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();
        shiftDemand.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftDemandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shiftDemand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shiftDemand))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShiftDemand() throws Exception {
        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();
        shiftDemand.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftDemandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shiftDemand))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShiftDemand() throws Exception {
        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();
        shiftDemand.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftDemandMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftDemand)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShiftDemandWithPatch() throws Exception {
        // Initialize the database
        shiftDemandRepository.saveAndFlush(shiftDemand);

        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();

        // Update the shiftDemand using partial update
        ShiftDemand partialUpdatedShiftDemand = new ShiftDemand();
        partialUpdatedShiftDemand.setId(shiftDemand.getId());

        partialUpdatedShiftDemand.count(UPDATED_COUNT);

        restShiftDemandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShiftDemand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShiftDemand))
            )
            .andExpect(status().isOk());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
        ShiftDemand testShiftDemand = shiftDemandList.get(shiftDemandList.size() - 1);
        assertThat(testShiftDemand.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void fullUpdateShiftDemandWithPatch() throws Exception {
        // Initialize the database
        shiftDemandRepository.saveAndFlush(shiftDemand);

        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();

        // Update the shiftDemand using partial update
        ShiftDemand partialUpdatedShiftDemand = new ShiftDemand();
        partialUpdatedShiftDemand.setId(shiftDemand.getId());

        partialUpdatedShiftDemand.count(UPDATED_COUNT);

        restShiftDemandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShiftDemand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShiftDemand))
            )
            .andExpect(status().isOk());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
        ShiftDemand testShiftDemand = shiftDemandList.get(shiftDemandList.size() - 1);
        assertThat(testShiftDemand.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void patchNonExistingShiftDemand() throws Exception {
        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();
        shiftDemand.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftDemandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shiftDemand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shiftDemand))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShiftDemand() throws Exception {
        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();
        shiftDemand.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftDemandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shiftDemand))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShiftDemand() throws Exception {
        int databaseSizeBeforeUpdate = shiftDemandRepository.findAll().size();
        shiftDemand.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftDemandMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shiftDemand))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShiftDemand in the database
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShiftDemand() throws Exception {
        // Initialize the database
        shiftDemandRepository.saveAndFlush(shiftDemand);

        int databaseSizeBeforeDelete = shiftDemandRepository.findAll().size();

        // Delete the shiftDemand
        restShiftDemandMockMvc
            .perform(delete(ENTITY_API_URL_ID, shiftDemand.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShiftDemand> shiftDemandList = shiftDemandRepository.findAll();
        assertThat(shiftDemandList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

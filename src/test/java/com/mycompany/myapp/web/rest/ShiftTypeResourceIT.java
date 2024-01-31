package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ShiftType;
import com.mycompany.myapp.repository.ShiftTypeRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ShiftTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShiftTypeResourceIT {

    private static final Long DEFAULT_KEY = 1L;
    private static final Long UPDATED_KEY = 2L;

    private static final Instant DEFAULT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/shift-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShiftTypeRepository shiftTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShiftTypeMockMvc;

    private ShiftType shiftType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShiftType createEntity(EntityManager em) {
        ShiftType shiftType = new ShiftType().key(DEFAULT_KEY).start(DEFAULT_START).end(DEFAULT_END);
        return shiftType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShiftType createUpdatedEntity(EntityManager em) {
        ShiftType shiftType = new ShiftType().key(UPDATED_KEY).start(UPDATED_START).end(UPDATED_END);
        return shiftType;
    }

    @BeforeEach
    public void initTest() {
        shiftType = createEntity(em);
    }

    @Test
    @Transactional
    void createShiftType() throws Exception {
        int databaseSizeBeforeCreate = shiftTypeRepository.findAll().size();
        // Create the ShiftType
        restShiftTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftType)))
            .andExpect(status().isCreated());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ShiftType testShiftType = shiftTypeList.get(shiftTypeList.size() - 1);
        assertThat(testShiftType.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testShiftType.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testShiftType.getEnd()).isEqualTo(DEFAULT_END);
    }

    @Test
    @Transactional
    void createShiftTypeWithExistingId() throws Exception {
        // Create the ShiftType with an existing ID
        shiftType.setId(1L);

        int databaseSizeBeforeCreate = shiftTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShiftTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftType)))
            .andExpect(status().isBadRequest());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShiftTypes() throws Exception {
        // Initialize the database
        shiftTypeRepository.saveAndFlush(shiftType);

        // Get all the shiftTypeList
        restShiftTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shiftType.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())));
    }

    @Test
    @Transactional
    void getShiftType() throws Exception {
        // Initialize the database
        shiftTypeRepository.saveAndFlush(shiftType);

        // Get the shiftType
        restShiftTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, shiftType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shiftType.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()));
    }

    @Test
    @Transactional
    void getNonExistingShiftType() throws Exception {
        // Get the shiftType
        restShiftTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShiftType() throws Exception {
        // Initialize the database
        shiftTypeRepository.saveAndFlush(shiftType);

        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();

        // Update the shiftType
        ShiftType updatedShiftType = shiftTypeRepository.findById(shiftType.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedShiftType are not directly saved in db
        em.detach(updatedShiftType);
        updatedShiftType.key(UPDATED_KEY).start(UPDATED_START).end(UPDATED_END);

        restShiftTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShiftType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShiftType))
            )
            .andExpect(status().isOk());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
        ShiftType testShiftType = shiftTypeList.get(shiftTypeList.size() - 1);
        assertThat(testShiftType.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShiftType.getStart()).isEqualTo(UPDATED_START);
        assertThat(testShiftType.getEnd()).isEqualTo(UPDATED_END);
    }

    @Test
    @Transactional
    void putNonExistingShiftType() throws Exception {
        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();
        shiftType.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shiftType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shiftType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShiftType() throws Exception {
        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();
        shiftType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shiftType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShiftType() throws Exception {
        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();
        shiftType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShiftTypeWithPatch() throws Exception {
        // Initialize the database
        shiftTypeRepository.saveAndFlush(shiftType);

        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();

        // Update the shiftType using partial update
        ShiftType partialUpdatedShiftType = new ShiftType();
        partialUpdatedShiftType.setId(shiftType.getId());

        partialUpdatedShiftType.start(UPDATED_START);

        restShiftTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShiftType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShiftType))
            )
            .andExpect(status().isOk());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
        ShiftType testShiftType = shiftTypeList.get(shiftTypeList.size() - 1);
        assertThat(testShiftType.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testShiftType.getStart()).isEqualTo(UPDATED_START);
        assertThat(testShiftType.getEnd()).isEqualTo(DEFAULT_END);
    }

    @Test
    @Transactional
    void fullUpdateShiftTypeWithPatch() throws Exception {
        // Initialize the database
        shiftTypeRepository.saveAndFlush(shiftType);

        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();

        // Update the shiftType using partial update
        ShiftType partialUpdatedShiftType = new ShiftType();
        partialUpdatedShiftType.setId(shiftType.getId());

        partialUpdatedShiftType.key(UPDATED_KEY).start(UPDATED_START).end(UPDATED_END);

        restShiftTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShiftType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShiftType))
            )
            .andExpect(status().isOk());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
        ShiftType testShiftType = shiftTypeList.get(shiftTypeList.size() - 1);
        assertThat(testShiftType.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShiftType.getStart()).isEqualTo(UPDATED_START);
        assertThat(testShiftType.getEnd()).isEqualTo(UPDATED_END);
    }

    @Test
    @Transactional
    void patchNonExistingShiftType() throws Exception {
        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();
        shiftType.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shiftType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shiftType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShiftType() throws Exception {
        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();
        shiftType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shiftType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShiftType() throws Exception {
        int databaseSizeBeforeUpdate = shiftTypeRepository.findAll().size();
        shiftType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shiftType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShiftType in the database
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShiftType() throws Exception {
        // Initialize the database
        shiftTypeRepository.saveAndFlush(shiftType);

        int databaseSizeBeforeDelete = shiftTypeRepository.findAll().size();

        // Delete the shiftType
        restShiftTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, shiftType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShiftType> shiftTypeList = shiftTypeRepository.findAll();
        assertThat(shiftTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

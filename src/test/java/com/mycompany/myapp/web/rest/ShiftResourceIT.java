package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Shift;
import com.mycompany.myapp.repository.ShiftRepository;
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
 * Integration tests for the {@link ShiftResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShiftResourceIT {

    private static final Long DEFAULT_KEY = 1L;
    private static final Long UPDATED_KEY = 2L;

    private static final Instant DEFAULT_SHIFT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_SHIFT_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_SHIFT_END = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_SHIFT_END = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/shifts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShiftMockMvc;

    private Shift shift;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shift createEntity(EntityManager em) {
        Shift shift = new Shift().key(DEFAULT_KEY).shiftStart(DEFAULT_SHIFT_START).shiftEnd(DEFAULT_SHIFT_END).type(DEFAULT_TYPE);
        return shift;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shift createUpdatedEntity(EntityManager em) {
        Shift shift = new Shift().key(UPDATED_KEY).shiftStart(UPDATED_SHIFT_START).shiftEnd(UPDATED_SHIFT_END).type(UPDATED_TYPE);
        return shift;
    }

    @BeforeEach
    public void initTest() {
        shift = createEntity(em);
    }

    @Test
    @Transactional
    void createShift() throws Exception {
        int databaseSizeBeforeCreate = shiftRepository.findAll().size();
        // Create the Shift
        restShiftMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isCreated());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeCreate + 1);
        Shift testShift = shiftList.get(shiftList.size() - 1);
        assertThat(testShift.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testShift.getShiftStart()).isEqualTo(DEFAULT_SHIFT_START);
        assertThat(testShift.getShiftEnd()).isEqualTo(DEFAULT_SHIFT_END);
        assertThat(testShift.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createShiftWithExistingId() throws Exception {
        // Create the Shift with an existing ID
        shift.setId(1L);

        int databaseSizeBeforeCreate = shiftRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShiftMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShifts() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        // Get all the shiftList
        restShiftMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shift.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.intValue())))
            .andExpect(jsonPath("$.[*].shiftStart").value(hasItem(DEFAULT_SHIFT_START.toString())))
            .andExpect(jsonPath("$.[*].shiftEnd").value(hasItem(DEFAULT_SHIFT_END.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @Test
    @Transactional
    void getShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        // Get the shift
        restShiftMockMvc
            .perform(get(ENTITY_API_URL_ID, shift.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shift.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.intValue()))
            .andExpect(jsonPath("$.shiftStart").value(DEFAULT_SHIFT_START.toString()))
            .andExpect(jsonPath("$.shiftEnd").value(DEFAULT_SHIFT_END.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingShift() throws Exception {
        // Get the shift
        restShiftMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();

        // Update the shift
        Shift updatedShift = shiftRepository.findById(shift.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedShift are not directly saved in db
        em.detach(updatedShift);
        updatedShift.key(UPDATED_KEY).shiftStart(UPDATED_SHIFT_START).shiftEnd(UPDATED_SHIFT_END).type(UPDATED_TYPE);

        restShiftMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShift.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShift))
            )
            .andExpect(status().isOk());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
        Shift testShift = shiftList.get(shiftList.size() - 1);
        assertThat(testShift.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShift.getShiftStart()).isEqualTo(UPDATED_SHIFT_START);
        assertThat(testShift.getShiftEnd()).isEqualTo(UPDATED_SHIFT_END);
        assertThat(testShift.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();
        shift.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shift.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();
        shift.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();
        shift.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShiftWithPatch() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();

        // Update the shift using partial update
        Shift partialUpdatedShift = new Shift();
        partialUpdatedShift.setId(shift.getId());

        partialUpdatedShift.key(UPDATED_KEY).shiftEnd(UPDATED_SHIFT_END);

        restShiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShift.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShift))
            )
            .andExpect(status().isOk());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
        Shift testShift = shiftList.get(shiftList.size() - 1);
        assertThat(testShift.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShift.getShiftStart()).isEqualTo(DEFAULT_SHIFT_START);
        assertThat(testShift.getShiftEnd()).isEqualTo(UPDATED_SHIFT_END);
        assertThat(testShift.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateShiftWithPatch() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();

        // Update the shift using partial update
        Shift partialUpdatedShift = new Shift();
        partialUpdatedShift.setId(shift.getId());

        partialUpdatedShift.key(UPDATED_KEY).shiftStart(UPDATED_SHIFT_START).shiftEnd(UPDATED_SHIFT_END).type(UPDATED_TYPE);

        restShiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShift.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShift))
            )
            .andExpect(status().isOk());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
        Shift testShift = shiftList.get(shiftList.size() - 1);
        assertThat(testShift.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShift.getShiftStart()).isEqualTo(UPDATED_SHIFT_START);
        assertThat(testShift.getShiftEnd()).isEqualTo(UPDATED_SHIFT_END);
        assertThat(testShift.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();
        shift.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shift.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();
        shift.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shift))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();
        shift.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        int databaseSizeBeforeDelete = shiftRepository.findAll().size();

        // Delete the shift
        restShiftMockMvc
            .perform(delete(ENTITY_API_URL_ID, shift.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

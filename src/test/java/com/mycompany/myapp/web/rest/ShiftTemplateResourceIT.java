package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ShiftTemplate;
import com.mycompany.myapp.repository.ShiftTemplateRepository;
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
 * Integration tests for the {@link ShiftTemplateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShiftTemplateResourceIT {

    private static final Long DEFAULT_KEY = 1L;
    private static final Long UPDATED_KEY = 2L;

    private static final Instant DEFAULT_SHIFT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_SHIFT_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_SHIFT_END = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_SHIFT_END = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/shift-templates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShiftTemplateRepository shiftTemplateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShiftTemplateMockMvc;

    private ShiftTemplate shiftTemplate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShiftTemplate createEntity(EntityManager em) {
        ShiftTemplate shiftTemplate = new ShiftTemplate()
            .key(DEFAULT_KEY)
            .shiftStart(DEFAULT_SHIFT_START)
            .shiftEnd(DEFAULT_SHIFT_END)
            .type(DEFAULT_TYPE);
        return shiftTemplate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShiftTemplate createUpdatedEntity(EntityManager em) {
        ShiftTemplate shiftTemplate = new ShiftTemplate()
            .key(UPDATED_KEY)
            .shiftStart(UPDATED_SHIFT_START)
            .shiftEnd(UPDATED_SHIFT_END)
            .type(UPDATED_TYPE);
        return shiftTemplate;
    }

    @BeforeEach
    public void initTest() {
        shiftTemplate = createEntity(em);
    }

    @Test
    @Transactional
    void createShiftTemplate() throws Exception {
        int databaseSizeBeforeCreate = shiftTemplateRepository.findAll().size();
        // Create the ShiftTemplate
        restShiftTemplateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftTemplate)))
            .andExpect(status().isCreated());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeCreate + 1);
        ShiftTemplate testShiftTemplate = shiftTemplateList.get(shiftTemplateList.size() - 1);
        assertThat(testShiftTemplate.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testShiftTemplate.getShiftStart()).isEqualTo(DEFAULT_SHIFT_START);
        assertThat(testShiftTemplate.getShiftEnd()).isEqualTo(DEFAULT_SHIFT_END);
        assertThat(testShiftTemplate.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createShiftTemplateWithExistingId() throws Exception {
        // Create the ShiftTemplate with an existing ID
        shiftTemplate.setId(1L);

        int databaseSizeBeforeCreate = shiftTemplateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShiftTemplateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftTemplate)))
            .andExpect(status().isBadRequest());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShiftTemplates() throws Exception {
        // Initialize the database
        shiftTemplateRepository.saveAndFlush(shiftTemplate);

        // Get all the shiftTemplateList
        restShiftTemplateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shiftTemplate.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.intValue())))
            .andExpect(jsonPath("$.[*].shiftStart").value(hasItem(DEFAULT_SHIFT_START.toString())))
            .andExpect(jsonPath("$.[*].shiftEnd").value(hasItem(DEFAULT_SHIFT_END.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)));
    }

    @Test
    @Transactional
    void getShiftTemplate() throws Exception {
        // Initialize the database
        shiftTemplateRepository.saveAndFlush(shiftTemplate);

        // Get the shiftTemplate
        restShiftTemplateMockMvc
            .perform(get(ENTITY_API_URL_ID, shiftTemplate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shiftTemplate.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.intValue()))
            .andExpect(jsonPath("$.shiftStart").value(DEFAULT_SHIFT_START.toString()))
            .andExpect(jsonPath("$.shiftEnd").value(DEFAULT_SHIFT_END.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingShiftTemplate() throws Exception {
        // Get the shiftTemplate
        restShiftTemplateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShiftTemplate() throws Exception {
        // Initialize the database
        shiftTemplateRepository.saveAndFlush(shiftTemplate);

        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();

        // Update the shiftTemplate
        ShiftTemplate updatedShiftTemplate = shiftTemplateRepository.findById(shiftTemplate.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedShiftTemplate are not directly saved in db
        em.detach(updatedShiftTemplate);
        updatedShiftTemplate.key(UPDATED_KEY).shiftStart(UPDATED_SHIFT_START).shiftEnd(UPDATED_SHIFT_END).type(UPDATED_TYPE);

        restShiftTemplateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShiftTemplate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShiftTemplate))
            )
            .andExpect(status().isOk());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
        ShiftTemplate testShiftTemplate = shiftTemplateList.get(shiftTemplateList.size() - 1);
        assertThat(testShiftTemplate.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShiftTemplate.getShiftStart()).isEqualTo(UPDATED_SHIFT_START);
        assertThat(testShiftTemplate.getShiftEnd()).isEqualTo(UPDATED_SHIFT_END);
        assertThat(testShiftTemplate.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingShiftTemplate() throws Exception {
        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();
        shiftTemplate.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftTemplateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shiftTemplate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shiftTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShiftTemplate() throws Exception {
        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();
        shiftTemplate.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTemplateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shiftTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShiftTemplate() throws Exception {
        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();
        shiftTemplate.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTemplateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shiftTemplate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShiftTemplateWithPatch() throws Exception {
        // Initialize the database
        shiftTemplateRepository.saveAndFlush(shiftTemplate);

        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();

        // Update the shiftTemplate using partial update
        ShiftTemplate partialUpdatedShiftTemplate = new ShiftTemplate();
        partialUpdatedShiftTemplate.setId(shiftTemplate.getId());

        partialUpdatedShiftTemplate.key(UPDATED_KEY).shiftStart(UPDATED_SHIFT_START).type(UPDATED_TYPE);

        restShiftTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShiftTemplate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShiftTemplate))
            )
            .andExpect(status().isOk());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
        ShiftTemplate testShiftTemplate = shiftTemplateList.get(shiftTemplateList.size() - 1);
        assertThat(testShiftTemplate.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShiftTemplate.getShiftStart()).isEqualTo(UPDATED_SHIFT_START);
        assertThat(testShiftTemplate.getShiftEnd()).isEqualTo(DEFAULT_SHIFT_END);
        assertThat(testShiftTemplate.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateShiftTemplateWithPatch() throws Exception {
        // Initialize the database
        shiftTemplateRepository.saveAndFlush(shiftTemplate);

        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();

        // Update the shiftTemplate using partial update
        ShiftTemplate partialUpdatedShiftTemplate = new ShiftTemplate();
        partialUpdatedShiftTemplate.setId(shiftTemplate.getId());

        partialUpdatedShiftTemplate.key(UPDATED_KEY).shiftStart(UPDATED_SHIFT_START).shiftEnd(UPDATED_SHIFT_END).type(UPDATED_TYPE);

        restShiftTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShiftTemplate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShiftTemplate))
            )
            .andExpect(status().isOk());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
        ShiftTemplate testShiftTemplate = shiftTemplateList.get(shiftTemplateList.size() - 1);
        assertThat(testShiftTemplate.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testShiftTemplate.getShiftStart()).isEqualTo(UPDATED_SHIFT_START);
        assertThat(testShiftTemplate.getShiftEnd()).isEqualTo(UPDATED_SHIFT_END);
        assertThat(testShiftTemplate.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingShiftTemplate() throws Exception {
        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();
        shiftTemplate.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shiftTemplate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shiftTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShiftTemplate() throws Exception {
        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();
        shiftTemplate.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shiftTemplate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShiftTemplate() throws Exception {
        int databaseSizeBeforeUpdate = shiftTemplateRepository.findAll().size();
        shiftTemplate.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShiftTemplateMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shiftTemplate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShiftTemplate in the database
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShiftTemplate() throws Exception {
        // Initialize the database
        shiftTemplateRepository.saveAndFlush(shiftTemplate);

        int databaseSizeBeforeDelete = shiftTemplateRepository.findAll().size();

        // Delete the shiftTemplate
        restShiftTemplateMockMvc
            .perform(delete(ENTITY_API_URL_ID, shiftTemplate.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShiftTemplate> shiftTemplateList = shiftTemplateRepository.findAll();
        assertThat(shiftTemplateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

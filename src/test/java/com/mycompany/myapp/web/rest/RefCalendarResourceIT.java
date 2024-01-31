package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.RefCalendar;
import com.mycompany.myapp.repository.RefCalendarRepository;
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
 * Integration tests for the {@link RefCalendarResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RefCalendarResourceIT {

    private static final Long DEFAULT_KEY = 1L;
    private static final Long UPDATED_KEY = 2L;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ref-calendars";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RefCalendarRepository refCalendarRepository;

    @Mock
    private RefCalendarRepository refCalendarRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRefCalendarMockMvc;

    private RefCalendar refCalendar;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RefCalendar createEntity(EntityManager em) {
        RefCalendar refCalendar = new RefCalendar().key(DEFAULT_KEY).status(DEFAULT_STATUS);
        return refCalendar;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RefCalendar createUpdatedEntity(EntityManager em) {
        RefCalendar refCalendar = new RefCalendar().key(UPDATED_KEY).status(UPDATED_STATUS);
        return refCalendar;
    }

    @BeforeEach
    public void initTest() {
        refCalendar = createEntity(em);
    }

    @Test
    @Transactional
    void createRefCalendar() throws Exception {
        int databaseSizeBeforeCreate = refCalendarRepository.findAll().size();
        // Create the RefCalendar
        restRefCalendarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refCalendar)))
            .andExpect(status().isCreated());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeCreate + 1);
        RefCalendar testRefCalendar = refCalendarList.get(refCalendarList.size() - 1);
        assertThat(testRefCalendar.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testRefCalendar.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createRefCalendarWithExistingId() throws Exception {
        // Create the RefCalendar with an existing ID
        refCalendar.setId(1L);

        int databaseSizeBeforeCreate = refCalendarRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRefCalendarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refCalendar)))
            .andExpect(status().isBadRequest());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRefCalendars() throws Exception {
        // Initialize the database
        refCalendarRepository.saveAndFlush(refCalendar);

        // Get all the refCalendarList
        restRefCalendarMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(refCalendar.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRefCalendarsWithEagerRelationshipsIsEnabled() throws Exception {
        when(refCalendarRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRefCalendarMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(refCalendarRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRefCalendarsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(refCalendarRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRefCalendarMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(refCalendarRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRefCalendar() throws Exception {
        // Initialize the database
        refCalendarRepository.saveAndFlush(refCalendar);

        // Get the refCalendar
        restRefCalendarMockMvc
            .perform(get(ENTITY_API_URL_ID, refCalendar.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(refCalendar.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingRefCalendar() throws Exception {
        // Get the refCalendar
        restRefCalendarMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRefCalendar() throws Exception {
        // Initialize the database
        refCalendarRepository.saveAndFlush(refCalendar);

        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();

        // Update the refCalendar
        RefCalendar updatedRefCalendar = refCalendarRepository.findById(refCalendar.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRefCalendar are not directly saved in db
        em.detach(updatedRefCalendar);
        updatedRefCalendar.key(UPDATED_KEY).status(UPDATED_STATUS);

        restRefCalendarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRefCalendar.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRefCalendar))
            )
            .andExpect(status().isOk());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
        RefCalendar testRefCalendar = refCalendarList.get(refCalendarList.size() - 1);
        assertThat(testRefCalendar.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testRefCalendar.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingRefCalendar() throws Exception {
        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();
        refCalendar.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefCalendarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, refCalendar.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refCalendar))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRefCalendar() throws Exception {
        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();
        refCalendar.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefCalendarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refCalendar))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRefCalendar() throws Exception {
        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();
        refCalendar.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefCalendarMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refCalendar)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRefCalendarWithPatch() throws Exception {
        // Initialize the database
        refCalendarRepository.saveAndFlush(refCalendar);

        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();

        // Update the refCalendar using partial update
        RefCalendar partialUpdatedRefCalendar = new RefCalendar();
        partialUpdatedRefCalendar.setId(refCalendar.getId());

        partialUpdatedRefCalendar.status(UPDATED_STATUS);

        restRefCalendarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefCalendar.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefCalendar))
            )
            .andExpect(status().isOk());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
        RefCalendar testRefCalendar = refCalendarList.get(refCalendarList.size() - 1);
        assertThat(testRefCalendar.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testRefCalendar.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateRefCalendarWithPatch() throws Exception {
        // Initialize the database
        refCalendarRepository.saveAndFlush(refCalendar);

        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();

        // Update the refCalendar using partial update
        RefCalendar partialUpdatedRefCalendar = new RefCalendar();
        partialUpdatedRefCalendar.setId(refCalendar.getId());

        partialUpdatedRefCalendar.key(UPDATED_KEY).status(UPDATED_STATUS);

        restRefCalendarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefCalendar.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefCalendar))
            )
            .andExpect(status().isOk());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
        RefCalendar testRefCalendar = refCalendarList.get(refCalendarList.size() - 1);
        assertThat(testRefCalendar.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testRefCalendar.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingRefCalendar() throws Exception {
        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();
        refCalendar.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefCalendarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, refCalendar.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refCalendar))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRefCalendar() throws Exception {
        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();
        refCalendar.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefCalendarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refCalendar))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRefCalendar() throws Exception {
        int databaseSizeBeforeUpdate = refCalendarRepository.findAll().size();
        refCalendar.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefCalendarMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(refCalendar))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RefCalendar in the database
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRefCalendar() throws Exception {
        // Initialize the database
        refCalendarRepository.saveAndFlush(refCalendar);

        int databaseSizeBeforeDelete = refCalendarRepository.findAll().size();

        // Delete the refCalendar
        restRefCalendarMockMvc
            .perform(delete(ENTITY_API_URL_ID, refCalendar.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RefCalendar> refCalendarList = refCalendarRepository.findAll();
        assertThat(refCalendarList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

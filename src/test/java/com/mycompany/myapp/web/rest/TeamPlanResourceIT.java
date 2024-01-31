package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TeamPlan;
import com.mycompany.myapp.repository.TeamPlanRepository;
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
 * Integration tests for the {@link TeamPlanResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TeamPlanResourceIT {

    private static final String ENTITY_API_URL = "/api/team-plans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TeamPlanRepository teamPlanRepository;

    @Mock
    private TeamPlanRepository teamPlanRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeamPlanMockMvc;

    private TeamPlan teamPlan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TeamPlan createEntity(EntityManager em) {
        TeamPlan teamPlan = new TeamPlan();
        return teamPlan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TeamPlan createUpdatedEntity(EntityManager em) {
        TeamPlan teamPlan = new TeamPlan();
        return teamPlan;
    }

    @BeforeEach
    public void initTest() {
        teamPlan = createEntity(em);
    }

    @Test
    @Transactional
    void createTeamPlan() throws Exception {
        int databaseSizeBeforeCreate = teamPlanRepository.findAll().size();
        // Create the TeamPlan
        restTeamPlanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teamPlan)))
            .andExpect(status().isCreated());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeCreate + 1);
        TeamPlan testTeamPlan = teamPlanList.get(teamPlanList.size() - 1);
    }

    @Test
    @Transactional
    void createTeamPlanWithExistingId() throws Exception {
        // Create the TeamPlan with an existing ID
        teamPlan.setId(1L);

        int databaseSizeBeforeCreate = teamPlanRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeamPlanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teamPlan)))
            .andExpect(status().isBadRequest());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTeamPlans() throws Exception {
        // Initialize the database
        teamPlanRepository.saveAndFlush(teamPlan);

        // Get all the teamPlanList
        restTeamPlanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teamPlan.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTeamPlansWithEagerRelationshipsIsEnabled() throws Exception {
        when(teamPlanRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTeamPlanMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(teamPlanRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTeamPlansWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(teamPlanRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTeamPlanMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(teamPlanRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTeamPlan() throws Exception {
        // Initialize the database
        teamPlanRepository.saveAndFlush(teamPlan);

        // Get the teamPlan
        restTeamPlanMockMvc
            .perform(get(ENTITY_API_URL_ID, teamPlan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teamPlan.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTeamPlan() throws Exception {
        // Get the teamPlan
        restTeamPlanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTeamPlan() throws Exception {
        // Initialize the database
        teamPlanRepository.saveAndFlush(teamPlan);

        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();

        // Update the teamPlan
        TeamPlan updatedTeamPlan = teamPlanRepository.findById(teamPlan.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTeamPlan are not directly saved in db
        em.detach(updatedTeamPlan);

        restTeamPlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTeamPlan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTeamPlan))
            )
            .andExpect(status().isOk());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
        TeamPlan testTeamPlan = teamPlanList.get(teamPlanList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingTeamPlan() throws Exception {
        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();
        teamPlan.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamPlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teamPlan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teamPlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTeamPlan() throws Exception {
        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();
        teamPlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamPlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teamPlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTeamPlan() throws Exception {
        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();
        teamPlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamPlanMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teamPlan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTeamPlanWithPatch() throws Exception {
        // Initialize the database
        teamPlanRepository.saveAndFlush(teamPlan);

        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();

        // Update the teamPlan using partial update
        TeamPlan partialUpdatedTeamPlan = new TeamPlan();
        partialUpdatedTeamPlan.setId(teamPlan.getId());

        restTeamPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeamPlan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeamPlan))
            )
            .andExpect(status().isOk());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
        TeamPlan testTeamPlan = teamPlanList.get(teamPlanList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateTeamPlanWithPatch() throws Exception {
        // Initialize the database
        teamPlanRepository.saveAndFlush(teamPlan);

        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();

        // Update the teamPlan using partial update
        TeamPlan partialUpdatedTeamPlan = new TeamPlan();
        partialUpdatedTeamPlan.setId(teamPlan.getId());

        restTeamPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeamPlan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeamPlan))
            )
            .andExpect(status().isOk());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
        TeamPlan testTeamPlan = teamPlanList.get(teamPlanList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingTeamPlan() throws Exception {
        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();
        teamPlan.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, teamPlan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teamPlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTeamPlan() throws Exception {
        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();
        teamPlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teamPlan))
            )
            .andExpect(status().isBadRequest());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTeamPlan() throws Exception {
        int databaseSizeBeforeUpdate = teamPlanRepository.findAll().size();
        teamPlan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeamPlanMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(teamPlan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TeamPlan in the database
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTeamPlan() throws Exception {
        // Initialize the database
        teamPlanRepository.saveAndFlush(teamPlan);

        int databaseSizeBeforeDelete = teamPlanRepository.findAll().size();

        // Delete the teamPlan
        restTeamPlanMockMvc
            .perform(delete(ENTITY_API_URL_ID, teamPlan.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TeamPlan> teamPlanList = teamPlanRepository.findAll();
        assertThat(teamPlanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

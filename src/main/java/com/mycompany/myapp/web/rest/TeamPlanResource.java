package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TeamPlan;
import com.mycompany.myapp.repository.TeamPlanRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.TeamPlan}.
 */
@RestController
@RequestMapping("/api/team-plans")
@Transactional
public class TeamPlanResource {

    private final Logger log = LoggerFactory.getLogger(TeamPlanResource.class);

    private static final String ENTITY_NAME = "teamPlan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeamPlanRepository teamPlanRepository;

    public TeamPlanResource(TeamPlanRepository teamPlanRepository) {
        this.teamPlanRepository = teamPlanRepository;
    }

    /**
     * {@code POST  /team-plans} : Create a new teamPlan.
     *
     * @param teamPlan the teamPlan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teamPlan, or with status {@code 400 (Bad Request)} if the teamPlan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TeamPlan> createTeamPlan(@RequestBody TeamPlan teamPlan) throws URISyntaxException {
        log.debug("REST request to save TeamPlan : {}", teamPlan);
        if (teamPlan.getId() != null) {
            throw new BadRequestAlertException("A new teamPlan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TeamPlan result = teamPlanRepository.save(teamPlan);
        return ResponseEntity
            .created(new URI("/api/team-plans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /team-plans/:id} : Updates an existing teamPlan.
     *
     * @param id the id of the teamPlan to save.
     * @param teamPlan the teamPlan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teamPlan,
     * or with status {@code 400 (Bad Request)} if the teamPlan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teamPlan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TeamPlan> updateTeamPlan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TeamPlan teamPlan
    ) throws URISyntaxException {
        log.debug("REST request to update TeamPlan : {}, {}", id, teamPlan);
        if (teamPlan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teamPlan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamPlanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TeamPlan result = teamPlanRepository.save(teamPlan);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teamPlan.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /team-plans/:id} : Partial updates given fields of an existing teamPlan, field will ignore if it is null
     *
     * @param id the id of the teamPlan to save.
     * @param teamPlan the teamPlan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teamPlan,
     * or with status {@code 400 (Bad Request)} if the teamPlan is not valid,
     * or with status {@code 404 (Not Found)} if the teamPlan is not found,
     * or with status {@code 500 (Internal Server Error)} if the teamPlan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TeamPlan> partialUpdateTeamPlan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TeamPlan teamPlan
    ) throws URISyntaxException {
        log.debug("REST request to partial update TeamPlan partially : {}, {}", id, teamPlan);
        if (teamPlan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teamPlan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamPlanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TeamPlan> result = teamPlanRepository.findById(teamPlan.getId()).map(teamPlanRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teamPlan.getId().toString())
        );
    }

    /**
     * {@code GET  /team-plans} : get all the teamPlans.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teamPlans in body.
     */
    @GetMapping("")
    public List<TeamPlan> getAllTeamPlans(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all TeamPlans");
        if (eagerload) {
            return teamPlanRepository.findAllWithEagerRelationships();
        } else {
            return teamPlanRepository.findAll();
        }
    }

    /**
     * {@code GET  /team-plans/:id} : get the "id" teamPlan.
     *
     * @param id the id of the teamPlan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teamPlan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TeamPlan> getTeamPlan(@PathVariable("id") Long id) {
        log.debug("REST request to get TeamPlan : {}", id);
        Optional<TeamPlan> teamPlan = teamPlanRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(teamPlan);
    }

    /**
     * {@code DELETE  /team-plans/:id} : delete the "id" teamPlan.
     *
     * @param id the id of the teamPlan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamPlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete TeamPlan : {}", id);
        teamPlanRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

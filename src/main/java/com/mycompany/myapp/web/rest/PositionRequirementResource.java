package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PositionRequirement;
import com.mycompany.myapp.repository.PositionRequirementRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.PositionRequirement}.
 */
@RestController
@RequestMapping("/api/position-requirements")
@Transactional
public class PositionRequirementResource {

    private final Logger log = LoggerFactory.getLogger(PositionRequirementResource.class);

    private static final String ENTITY_NAME = "positionRequirement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PositionRequirementRepository positionRequirementRepository;

    public PositionRequirementResource(PositionRequirementRepository positionRequirementRepository) {
        this.positionRequirementRepository = positionRequirementRepository;
    }

    /**
     * {@code POST  /position-requirements} : Create a new positionRequirement.
     *
     * @param positionRequirement the positionRequirement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new positionRequirement, or with status {@code 400 (Bad Request)} if the positionRequirement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PositionRequirement> createPositionRequirement(@RequestBody PositionRequirement positionRequirement)
        throws URISyntaxException {
        log.debug("REST request to save PositionRequirement : {}", positionRequirement);
        if (positionRequirement.getId() != null) {
            throw new BadRequestAlertException("A new positionRequirement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PositionRequirement result = positionRequirementRepository.save(positionRequirement);
        return ResponseEntity
            .created(new URI("/api/position-requirements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /position-requirements/:id} : Updates an existing positionRequirement.
     *
     * @param id the id of the positionRequirement to save.
     * @param positionRequirement the positionRequirement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated positionRequirement,
     * or with status {@code 400 (Bad Request)} if the positionRequirement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the positionRequirement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PositionRequirement> updatePositionRequirement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PositionRequirement positionRequirement
    ) throws URISyntaxException {
        log.debug("REST request to update PositionRequirement : {}, {}", id, positionRequirement);
        if (positionRequirement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, positionRequirement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!positionRequirementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PositionRequirement result = positionRequirementRepository.save(positionRequirement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, positionRequirement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /position-requirements/:id} : Partial updates given fields of an existing positionRequirement, field will ignore if it is null
     *
     * @param id the id of the positionRequirement to save.
     * @param positionRequirement the positionRequirement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated positionRequirement,
     * or with status {@code 400 (Bad Request)} if the positionRequirement is not valid,
     * or with status {@code 404 (Not Found)} if the positionRequirement is not found,
     * or with status {@code 500 (Internal Server Error)} if the positionRequirement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PositionRequirement> partialUpdatePositionRequirement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PositionRequirement positionRequirement
    ) throws URISyntaxException {
        log.debug("REST request to partial update PositionRequirement partially : {}, {}", id, positionRequirement);
        if (positionRequirement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, positionRequirement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!positionRequirementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PositionRequirement> result = positionRequirementRepository
            .findById(positionRequirement.getId())
            .map(existingPositionRequirement -> {
                if (positionRequirement.getMandatoty() != null) {
                    existingPositionRequirement.setMandatoty(positionRequirement.getMandatoty());
                }

                return existingPositionRequirement;
            })
            .map(positionRequirementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, positionRequirement.getId().toString())
        );
    }

    /**
     * {@code GET  /position-requirements} : get all the positionRequirements.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of positionRequirements in body.
     */
    @GetMapping("")
    public List<PositionRequirement> getAllPositionRequirements(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all PositionRequirements");
        if (eagerload) {
            return positionRequirementRepository.findAllWithEagerRelationships();
        } else {
            return positionRequirementRepository.findAll();
        }
    }

    /**
     * {@code GET  /position-requirements/:id} : get the "id" positionRequirement.
     *
     * @param id the id of the positionRequirement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the positionRequirement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PositionRequirement> getPositionRequirement(@PathVariable("id") Long id) {
        log.debug("REST request to get PositionRequirement : {}", id);
        Optional<PositionRequirement> positionRequirement = positionRequirementRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(positionRequirement);
    }

    /**
     * {@code DELETE  /position-requirements/:id} : delete the "id" positionRequirement.
     *
     * @param id the id of the positionRequirement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePositionRequirement(@PathVariable("id") Long id) {
        log.debug("REST request to delete PositionRequirement : {}", id);
        positionRequirementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

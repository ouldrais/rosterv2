package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ShiftDemand;
import com.mycompany.myapp.repository.ShiftDemandRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ShiftDemand}.
 */
@RestController
@RequestMapping("/api/shift-demands")
@Transactional
public class ShiftDemandResource {

    private final Logger log = LoggerFactory.getLogger(ShiftDemandResource.class);

    private static final String ENTITY_NAME = "shiftDemand";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShiftDemandRepository shiftDemandRepository;

    public ShiftDemandResource(ShiftDemandRepository shiftDemandRepository) {
        this.shiftDemandRepository = shiftDemandRepository;
    }

    /**
     * {@code POST  /shift-demands} : Create a new shiftDemand.
     *
     * @param shiftDemand the shiftDemand to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shiftDemand, or with status {@code 400 (Bad Request)} if the shiftDemand has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ShiftDemand> createShiftDemand(@RequestBody ShiftDemand shiftDemand) throws URISyntaxException {
        log.debug("REST request to save ShiftDemand : {}", shiftDemand);
        if (shiftDemand.getId() != null) {
            throw new BadRequestAlertException("A new shiftDemand cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShiftDemand result = shiftDemandRepository.save(shiftDemand);
        return ResponseEntity
            .created(new URI("/api/shift-demands/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shift-demands/:id} : Updates an existing shiftDemand.
     *
     * @param id the id of the shiftDemand to save.
     * @param shiftDemand the shiftDemand to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shiftDemand,
     * or with status {@code 400 (Bad Request)} if the shiftDemand is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shiftDemand couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ShiftDemand> updateShiftDemand(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShiftDemand shiftDemand
    ) throws URISyntaxException {
        log.debug("REST request to update ShiftDemand : {}, {}", id, shiftDemand);
        if (shiftDemand.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shiftDemand.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftDemandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShiftDemand result = shiftDemandRepository.save(shiftDemand);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shiftDemand.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shift-demands/:id} : Partial updates given fields of an existing shiftDemand, field will ignore if it is null
     *
     * @param id the id of the shiftDemand to save.
     * @param shiftDemand the shiftDemand to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shiftDemand,
     * or with status {@code 400 (Bad Request)} if the shiftDemand is not valid,
     * or with status {@code 404 (Not Found)} if the shiftDemand is not found,
     * or with status {@code 500 (Internal Server Error)} if the shiftDemand couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShiftDemand> partialUpdateShiftDemand(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShiftDemand shiftDemand
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShiftDemand partially : {}, {}", id, shiftDemand);
        if (shiftDemand.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shiftDemand.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftDemandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShiftDemand> result = shiftDemandRepository
            .findById(shiftDemand.getId())
            .map(existingShiftDemand -> {
                if (shiftDemand.getCount() != null) {
                    existingShiftDemand.setCount(shiftDemand.getCount());
                }

                return existingShiftDemand;
            })
            .map(shiftDemandRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shiftDemand.getId().toString())
        );
    }

    /**
     * {@code GET  /shift-demands} : get all the shiftDemands.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shiftDemands in body.
     */
    @GetMapping("")
    public List<ShiftDemand> getAllShiftDemands(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all ShiftDemands");
        if (eagerload) {
            return shiftDemandRepository.findAllWithEagerRelationships();
        } else {
            return shiftDemandRepository.findAll();
        }
    }

    /**
     * {@code GET  /shift-demands/:id} : get the "id" shiftDemand.
     *
     * @param id the id of the shiftDemand to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shiftDemand, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ShiftDemand> getShiftDemand(@PathVariable("id") Long id) {
        log.debug("REST request to get ShiftDemand : {}", id);
        Optional<ShiftDemand> shiftDemand = shiftDemandRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(shiftDemand);
    }

    /**
     * {@code DELETE  /shift-demands/:id} : delete the "id" shiftDemand.
     *
     * @param id the id of the shiftDemand to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShiftDemand(@PathVariable("id") Long id) {
        log.debug("REST request to delete ShiftDemand : {}", id);
        shiftDemandRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

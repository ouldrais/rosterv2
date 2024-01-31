package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ShiftType;
import com.mycompany.myapp.repository.ShiftTypeRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ShiftType}.
 */
@RestController
@RequestMapping("/api/shift-types")
@Transactional
public class ShiftTypeResource {

    private final Logger log = LoggerFactory.getLogger(ShiftTypeResource.class);

    private static final String ENTITY_NAME = "shiftType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShiftTypeRepository shiftTypeRepository;

    public ShiftTypeResource(ShiftTypeRepository shiftTypeRepository) {
        this.shiftTypeRepository = shiftTypeRepository;
    }

    /**
     * {@code POST  /shift-types} : Create a new shiftType.
     *
     * @param shiftType the shiftType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shiftType, or with status {@code 400 (Bad Request)} if the shiftType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ShiftType> createShiftType(@RequestBody ShiftType shiftType) throws URISyntaxException {
        log.debug("REST request to save ShiftType : {}", shiftType);
        if (shiftType.getId() != null) {
            throw new BadRequestAlertException("A new shiftType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShiftType result = shiftTypeRepository.save(shiftType);
        return ResponseEntity
            .created(new URI("/api/shift-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shift-types/:id} : Updates an existing shiftType.
     *
     * @param id the id of the shiftType to save.
     * @param shiftType the shiftType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shiftType,
     * or with status {@code 400 (Bad Request)} if the shiftType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shiftType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ShiftType> updateShiftType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShiftType shiftType
    ) throws URISyntaxException {
        log.debug("REST request to update ShiftType : {}, {}", id, shiftType);
        if (shiftType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shiftType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShiftType result = shiftTypeRepository.save(shiftType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shiftType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shift-types/:id} : Partial updates given fields of an existing shiftType, field will ignore if it is null
     *
     * @param id the id of the shiftType to save.
     * @param shiftType the shiftType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shiftType,
     * or with status {@code 400 (Bad Request)} if the shiftType is not valid,
     * or with status {@code 404 (Not Found)} if the shiftType is not found,
     * or with status {@code 500 (Internal Server Error)} if the shiftType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShiftType> partialUpdateShiftType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShiftType shiftType
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShiftType partially : {}, {}", id, shiftType);
        if (shiftType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shiftType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShiftType> result = shiftTypeRepository
            .findById(shiftType.getId())
            .map(existingShiftType -> {
                if (shiftType.getKey() != null) {
                    existingShiftType.setKey(shiftType.getKey());
                }
                if (shiftType.getStart() != null) {
                    existingShiftType.setStart(shiftType.getStart());
                }
                if (shiftType.getEnd() != null) {
                    existingShiftType.setEnd(shiftType.getEnd());
                }

                return existingShiftType;
            })
            .map(shiftTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shiftType.getId().toString())
        );
    }

    /**
     * {@code GET  /shift-types} : get all the shiftTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shiftTypes in body.
     */
    @GetMapping("")
    public List<ShiftType> getAllShiftTypes() {
        log.debug("REST request to get all ShiftTypes");
        return shiftTypeRepository.findAll();
    }

    /**
     * {@code GET  /shift-types/:id} : get the "id" shiftType.
     *
     * @param id the id of the shiftType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shiftType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ShiftType> getShiftType(@PathVariable("id") Long id) {
        log.debug("REST request to get ShiftType : {}", id);
        Optional<ShiftType> shiftType = shiftTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shiftType);
    }

    /**
     * {@code DELETE  /shift-types/:id} : delete the "id" shiftType.
     *
     * @param id the id of the shiftType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShiftType(@PathVariable("id") Long id) {
        log.debug("REST request to delete ShiftType : {}", id);
        shiftTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

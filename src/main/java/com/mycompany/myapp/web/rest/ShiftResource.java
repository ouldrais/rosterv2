package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Shift;
import com.mycompany.myapp.repository.ShiftRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Shift}.
 */
@RestController
@RequestMapping("/api/shifts")
@Transactional
public class ShiftResource {

    private final Logger log = LoggerFactory.getLogger(ShiftResource.class);

    private static final String ENTITY_NAME = "shift";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShiftRepository shiftRepository;

    public ShiftResource(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    /**
     * {@code POST  /shifts} : Create a new shift.
     *
     * @param shift the shift to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shift, or with status {@code 400 (Bad Request)} if the shift has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Shift> createShift(@RequestBody Shift shift) throws URISyntaxException {
        log.debug("REST request to save Shift : {}", shift);
        if (shift.getId() != null) {
            throw new BadRequestAlertException("A new shift cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shift result = shiftRepository.save(shift);
        return ResponseEntity
            .created(new URI("/api/shifts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shifts/:id} : Updates an existing shift.
     *
     * @param id the id of the shift to save.
     * @param shift the shift to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shift,
     * or with status {@code 400 (Bad Request)} if the shift is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shift couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable(value = "id", required = false) final Long id, @RequestBody Shift shift)
        throws URISyntaxException {
        log.debug("REST request to update Shift : {}, {}", id, shift);
        if (shift.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shift.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Shift result = shiftRepository.save(shift);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shift.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shifts/:id} : Partial updates given fields of an existing shift, field will ignore if it is null
     *
     * @param id the id of the shift to save.
     * @param shift the shift to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shift,
     * or with status {@code 400 (Bad Request)} if the shift is not valid,
     * or with status {@code 404 (Not Found)} if the shift is not found,
     * or with status {@code 500 (Internal Server Error)} if the shift couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Shift> partialUpdateShift(@PathVariable(value = "id", required = false) final Long id, @RequestBody Shift shift)
        throws URISyntaxException {
        log.debug("REST request to partial update Shift partially : {}, {}", id, shift);
        if (shift.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shift.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Shift> result = shiftRepository
            .findById(shift.getId())
            .map(existingShift -> {
                if (shift.getKey() != null) {
                    existingShift.setKey(shift.getKey());
                }
                if (shift.getShiftStart() != null) {
                    existingShift.setShiftStart(shift.getShiftStart());
                }
                if (shift.getShiftEnd() != null) {
                    existingShift.setShiftEnd(shift.getShiftEnd());
                }
                if (shift.getType() != null) {
                    existingShift.setType(shift.getType());
                }

                return existingShift;
            })
            .map(shiftRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shift.getId().toString())
        );
    }

    /**
     * {@code GET  /shifts} : get all the shifts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shifts in body.
     */
    @GetMapping("")
    public List<Shift> getAllShifts() {
        log.debug("REST request to get all Shifts");
        return shiftRepository.findAll();
    }

    /**
     * {@code GET  /shifts/:id} : get the "id" shift.
     *
     * @param id the id of the shift to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shift, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShift(@PathVariable("id") Long id) {
        log.debug("REST request to get Shift : {}", id);
        Optional<Shift> shift = shiftRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shift);
    }

    /**
     * {@code DELETE  /shifts/:id} : delete the "id" shift.
     *
     * @param id the id of the shift to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable("id") Long id) {
        log.debug("REST request to delete Shift : {}", id);
        shiftRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.RefCalendar;
import com.mycompany.myapp.repository.RefCalendarRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.RefCalendar}.
 */
@RestController
@RequestMapping("/api/ref-calendars")
@Transactional
public class RefCalendarResource {

    private final Logger log = LoggerFactory.getLogger(RefCalendarResource.class);

    private static final String ENTITY_NAME = "refCalendar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RefCalendarRepository refCalendarRepository;

    public RefCalendarResource(RefCalendarRepository refCalendarRepository) {
        this.refCalendarRepository = refCalendarRepository;
    }

    /**
     * {@code POST  /ref-calendars} : Create a new refCalendar.
     *
     * @param refCalendar the refCalendar to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new refCalendar, or with status {@code 400 (Bad Request)} if the refCalendar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RefCalendar> createRefCalendar(@RequestBody RefCalendar refCalendar) throws URISyntaxException {
        log.debug("REST request to save RefCalendar : {}", refCalendar);
        if (refCalendar.getId() != null) {
            throw new BadRequestAlertException("A new refCalendar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RefCalendar result = refCalendarRepository.save(refCalendar);
        return ResponseEntity
            .created(new URI("/api/ref-calendars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ref-calendars/:id} : Updates an existing refCalendar.
     *
     * @param id the id of the refCalendar to save.
     * @param refCalendar the refCalendar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated refCalendar,
     * or with status {@code 400 (Bad Request)} if the refCalendar is not valid,
     * or with status {@code 500 (Internal Server Error)} if the refCalendar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RefCalendar> updateRefCalendar(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RefCalendar refCalendar
    ) throws URISyntaxException {
        log.debug("REST request to update RefCalendar : {}, {}", id, refCalendar);
        if (refCalendar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, refCalendar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!refCalendarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RefCalendar result = refCalendarRepository.save(refCalendar);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, refCalendar.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ref-calendars/:id} : Partial updates given fields of an existing refCalendar, field will ignore if it is null
     *
     * @param id the id of the refCalendar to save.
     * @param refCalendar the refCalendar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated refCalendar,
     * or with status {@code 400 (Bad Request)} if the refCalendar is not valid,
     * or with status {@code 404 (Not Found)} if the refCalendar is not found,
     * or with status {@code 500 (Internal Server Error)} if the refCalendar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RefCalendar> partialUpdateRefCalendar(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RefCalendar refCalendar
    ) throws URISyntaxException {
        log.debug("REST request to partial update RefCalendar partially : {}, {}", id, refCalendar);
        if (refCalendar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, refCalendar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!refCalendarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RefCalendar> result = refCalendarRepository
            .findById(refCalendar.getId())
            .map(existingRefCalendar -> {
                if (refCalendar.getKey() != null) {
                    existingRefCalendar.setKey(refCalendar.getKey());
                }
                if (refCalendar.getStatus() != null) {
                    existingRefCalendar.setStatus(refCalendar.getStatus());
                }

                return existingRefCalendar;
            })
            .map(refCalendarRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, refCalendar.getId().toString())
        );
    }

    /**
     * {@code GET  /ref-calendars} : get all the refCalendars.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of refCalendars in body.
     */
    @GetMapping("")
    public List<RefCalendar> getAllRefCalendars(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all RefCalendars");
        if (eagerload) {
            return refCalendarRepository.findAllWithEagerRelationships();
        } else {
            return refCalendarRepository.findAll();
        }
    }

    /**
     * {@code GET  /ref-calendars/:id} : get the "id" refCalendar.
     *
     * @param id the id of the refCalendar to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the refCalendar, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RefCalendar> getRefCalendar(@PathVariable("id") Long id) {
        log.debug("REST request to get RefCalendar : {}", id);
        Optional<RefCalendar> refCalendar = refCalendarRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(refCalendar);
    }

    /**
     * {@code DELETE  /ref-calendars/:id} : delete the "id" refCalendar.
     *
     * @param id the id of the refCalendar to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRefCalendar(@PathVariable("id") Long id) {
        log.debug("REST request to delete RefCalendar : {}", id);
        refCalendarRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

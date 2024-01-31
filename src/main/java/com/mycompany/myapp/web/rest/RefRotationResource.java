package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.RefRotation;
import com.mycompany.myapp.repository.RefRotationRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.RefRotation}.
 */
@RestController
@RequestMapping("/api/ref-rotations")
@Transactional
public class RefRotationResource {

    private final Logger log = LoggerFactory.getLogger(RefRotationResource.class);

    private static final String ENTITY_NAME = "refRotation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RefRotationRepository refRotationRepository;

    public RefRotationResource(RefRotationRepository refRotationRepository) {
        this.refRotationRepository = refRotationRepository;
    }

    /**
     * {@code POST  /ref-rotations} : Create a new refRotation.
     *
     * @param refRotation the refRotation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new refRotation, or with status {@code 400 (Bad Request)} if the refRotation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RefRotation> createRefRotation(@RequestBody RefRotation refRotation) throws URISyntaxException {
        log.debug("REST request to save RefRotation : {}", refRotation);
        if (refRotation.getId() != null) {
            throw new BadRequestAlertException("A new refRotation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RefRotation result = refRotationRepository.save(refRotation);
        return ResponseEntity
            .created(new URI("/api/ref-rotations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ref-rotations/:id} : Updates an existing refRotation.
     *
     * @param id the id of the refRotation to save.
     * @param refRotation the refRotation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated refRotation,
     * or with status {@code 400 (Bad Request)} if the refRotation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the refRotation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RefRotation> updateRefRotation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RefRotation refRotation
    ) throws URISyntaxException {
        log.debug("REST request to update RefRotation : {}, {}", id, refRotation);
        if (refRotation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, refRotation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!refRotationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RefRotation result = refRotationRepository.save(refRotation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, refRotation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ref-rotations/:id} : Partial updates given fields of an existing refRotation, field will ignore if it is null
     *
     * @param id the id of the refRotation to save.
     * @param refRotation the refRotation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated refRotation,
     * or with status {@code 400 (Bad Request)} if the refRotation is not valid,
     * or with status {@code 404 (Not Found)} if the refRotation is not found,
     * or with status {@code 500 (Internal Server Error)} if the refRotation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RefRotation> partialUpdateRefRotation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RefRotation refRotation
    ) throws URISyntaxException {
        log.debug("REST request to partial update RefRotation partially : {}, {}", id, refRotation);
        if (refRotation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, refRotation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!refRotationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RefRotation> result = refRotationRepository
            .findById(refRotation.getId())
            .map(existingRefRotation -> {
                if (refRotation.getOrder() != null) {
                    existingRefRotation.setOrder(refRotation.getOrder());
                }

                return existingRefRotation;
            })
            .map(refRotationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, refRotation.getId().toString())
        );
    }

    /**
     * {@code GET  /ref-rotations} : get all the refRotations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of refRotations in body.
     */
    @GetMapping("")
    public List<RefRotation> getAllRefRotations(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all RefRotations");
        if (eagerload) {
            return refRotationRepository.findAllWithEagerRelationships();
        } else {
            return refRotationRepository.findAll();
        }
    }

    /**
     * {@code GET  /ref-rotations/:id} : get the "id" refRotation.
     *
     * @param id the id of the refRotation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the refRotation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RefRotation> getRefRotation(@PathVariable("id") Long id) {
        log.debug("REST request to get RefRotation : {}", id);
        Optional<RefRotation> refRotation = refRotationRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(refRotation);
    }

    /**
     * {@code DELETE  /ref-rotations/:id} : delete the "id" refRotation.
     *
     * @param id the id of the refRotation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRefRotation(@PathVariable("id") Long id) {
        log.debug("REST request to delete RefRotation : {}", id);
        refRotationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ShiftTemplate;
import com.mycompany.myapp.repository.ShiftTemplateRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ShiftTemplate}.
 */
@RestController
@RequestMapping("/api/shift-templates")
@Transactional
public class ShiftTemplateResource {

    private final Logger log = LoggerFactory.getLogger(ShiftTemplateResource.class);

    private static final String ENTITY_NAME = "shiftTemplate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShiftTemplateRepository shiftTemplateRepository;

    public ShiftTemplateResource(ShiftTemplateRepository shiftTemplateRepository) {
        this.shiftTemplateRepository = shiftTemplateRepository;
    }

    /**
     * {@code POST  /shift-templates} : Create a new shiftTemplate.
     *
     * @param shiftTemplate the shiftTemplate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shiftTemplate, or with status {@code 400 (Bad Request)} if the shiftTemplate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ShiftTemplate> createShiftTemplate(@RequestBody ShiftTemplate shiftTemplate) throws URISyntaxException {
        log.debug("REST request to save ShiftTemplate : {}", shiftTemplate);
        if (shiftTemplate.getId() != null) {
            throw new BadRequestAlertException("A new shiftTemplate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShiftTemplate result = shiftTemplateRepository.save(shiftTemplate);
        return ResponseEntity
            .created(new URI("/api/shift-templates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shift-templates/:id} : Updates an existing shiftTemplate.
     *
     * @param id the id of the shiftTemplate to save.
     * @param shiftTemplate the shiftTemplate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shiftTemplate,
     * or with status {@code 400 (Bad Request)} if the shiftTemplate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shiftTemplate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ShiftTemplate> updateShiftTemplate(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShiftTemplate shiftTemplate
    ) throws URISyntaxException {
        log.debug("REST request to update ShiftTemplate : {}, {}", id, shiftTemplate);
        if (shiftTemplate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shiftTemplate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftTemplateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShiftTemplate result = shiftTemplateRepository.save(shiftTemplate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shiftTemplate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shift-templates/:id} : Partial updates given fields of an existing shiftTemplate, field will ignore if it is null
     *
     * @param id the id of the shiftTemplate to save.
     * @param shiftTemplate the shiftTemplate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shiftTemplate,
     * or with status {@code 400 (Bad Request)} if the shiftTemplate is not valid,
     * or with status {@code 404 (Not Found)} if the shiftTemplate is not found,
     * or with status {@code 500 (Internal Server Error)} if the shiftTemplate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShiftTemplate> partialUpdateShiftTemplate(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShiftTemplate shiftTemplate
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShiftTemplate partially : {}, {}", id, shiftTemplate);
        if (shiftTemplate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shiftTemplate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shiftTemplateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShiftTemplate> result = shiftTemplateRepository
            .findById(shiftTemplate.getId())
            .map(existingShiftTemplate -> {
                if (shiftTemplate.getKey() != null) {
                    existingShiftTemplate.setKey(shiftTemplate.getKey());
                }
                if (shiftTemplate.getShiftStart() != null) {
                    existingShiftTemplate.setShiftStart(shiftTemplate.getShiftStart());
                }
                if (shiftTemplate.getShiftEnd() != null) {
                    existingShiftTemplate.setShiftEnd(shiftTemplate.getShiftEnd());
                }
                if (shiftTemplate.getType() != null) {
                    existingShiftTemplate.setType(shiftTemplate.getType());
                }

                return existingShiftTemplate;
            })
            .map(shiftTemplateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shiftTemplate.getId().toString())
        );
    }

    /**
     * {@code GET  /shift-templates} : get all the shiftTemplates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shiftTemplates in body.
     */
    @GetMapping("")
    public List<ShiftTemplate> getAllShiftTemplates() {
        log.debug("REST request to get all ShiftTemplates");
        return shiftTemplateRepository.findAll();
    }

    /**
     * {@code GET  /shift-templates/:id} : get the "id" shiftTemplate.
     *
     * @param id the id of the shiftTemplate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shiftTemplate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ShiftTemplate> getShiftTemplate(@PathVariable("id") Long id) {
        log.debug("REST request to get ShiftTemplate : {}", id);
        Optional<ShiftTemplate> shiftTemplate = shiftTemplateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shiftTemplate);
    }

    /**
     * {@code DELETE  /shift-templates/:id} : delete the "id" shiftTemplate.
     *
     * @param id the id of the shiftTemplate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShiftTemplate(@PathVariable("id") Long id) {
        log.debug("REST request to delete ShiftTemplate : {}", id);
        shiftTemplateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

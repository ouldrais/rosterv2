package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ResourceTraining;
import com.mycompany.myapp.repository.ResourceTrainingRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ResourceTraining}.
 */
@RestController
@RequestMapping("/api/resource-trainings")
@Transactional
public class ResourceTrainingResource {

    private final Logger log = LoggerFactory.getLogger(ResourceTrainingResource.class);

    private static final String ENTITY_NAME = "resourceTraining";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResourceTrainingRepository resourceTrainingRepository;

    public ResourceTrainingResource(ResourceTrainingRepository resourceTrainingRepository) {
        this.resourceTrainingRepository = resourceTrainingRepository;
    }

    /**
     * {@code POST  /resource-trainings} : Create a new resourceTraining.
     *
     * @param resourceTraining the resourceTraining to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resourceTraining, or with status {@code 400 (Bad Request)} if the resourceTraining has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ResourceTraining> createResourceTraining(@RequestBody ResourceTraining resourceTraining)
        throws URISyntaxException {
        log.debug("REST request to save ResourceTraining : {}", resourceTraining);
        if (resourceTraining.getId() != null) {
            throw new BadRequestAlertException("A new resourceTraining cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResourceTraining result = resourceTrainingRepository.save(resourceTraining);
        return ResponseEntity
            .created(new URI("/api/resource-trainings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /resource-trainings/:id} : Updates an existing resourceTraining.
     *
     * @param id the id of the resourceTraining to save.
     * @param resourceTraining the resourceTraining to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourceTraining,
     * or with status {@code 400 (Bad Request)} if the resourceTraining is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resourceTraining couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceTraining> updateResourceTraining(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ResourceTraining resourceTraining
    ) throws URISyntaxException {
        log.debug("REST request to update ResourceTraining : {}, {}", id, resourceTraining);
        if (resourceTraining.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourceTraining.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourceTrainingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ResourceTraining result = resourceTrainingRepository.save(resourceTraining);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourceTraining.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /resource-trainings/:id} : Partial updates given fields of an existing resourceTraining, field will ignore if it is null
     *
     * @param id the id of the resourceTraining to save.
     * @param resourceTraining the resourceTraining to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourceTraining,
     * or with status {@code 400 (Bad Request)} if the resourceTraining is not valid,
     * or with status {@code 404 (Not Found)} if the resourceTraining is not found,
     * or with status {@code 500 (Internal Server Error)} if the resourceTraining couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ResourceTraining> partialUpdateResourceTraining(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ResourceTraining resourceTraining
    ) throws URISyntaxException {
        log.debug("REST request to partial update ResourceTraining partially : {}, {}", id, resourceTraining);
        if (resourceTraining.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourceTraining.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourceTrainingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ResourceTraining> result = resourceTrainingRepository
            .findById(resourceTraining.getId())
            .map(existingResourceTraining -> {
                if (resourceTraining.getStatus() != null) {
                    existingResourceTraining.setStatus(resourceTraining.getStatus());
                }
                if (resourceTraining.getLevel() != null) {
                    existingResourceTraining.setLevel(resourceTraining.getLevel());
                }
                if (resourceTraining.getTrainer() != null) {
                    existingResourceTraining.setTrainer(resourceTraining.getTrainer());
                }
                if (resourceTraining.getActiveFrom() != null) {
                    existingResourceTraining.setActiveFrom(resourceTraining.getActiveFrom());
                }
                if (resourceTraining.getActiveto() != null) {
                    existingResourceTraining.setActiveto(resourceTraining.getActiveto());
                }

                return existingResourceTraining;
            })
            .map(resourceTrainingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourceTraining.getId().toString())
        );
    }

    /**
     * {@code GET  /resource-trainings} : get all the resourceTrainings.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resourceTrainings in body.
     */
    @GetMapping("")
    public List<ResourceTraining> getAllResourceTrainings(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all ResourceTrainings");
        if (eagerload) {
            return resourceTrainingRepository.findAllWithEagerRelationships();
        } else {
            return resourceTrainingRepository.findAll();
        }
    }

    /**
     * {@code GET  /resource-trainings/:id} : get the "id" resourceTraining.
     *
     * @param id the id of the resourceTraining to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resourceTraining, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceTraining> getResourceTraining(@PathVariable("id") Long id) {
        log.debug("REST request to get ResourceTraining : {}", id);
        Optional<ResourceTraining> resourceTraining = resourceTrainingRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(resourceTraining);
    }

    /**
     * {@code DELETE  /resource-trainings/:id} : delete the "id" resourceTraining.
     *
     * @param id the id of the resourceTraining to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResourceTraining(@PathVariable("id") Long id) {
        log.debug("REST request to delete ResourceTraining : {}", id);
        resourceTrainingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

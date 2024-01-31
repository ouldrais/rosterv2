package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ResourcePlan;
import com.mycompany.myapp.repository.ResourcePlanRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ResourcePlan}.
 */
@RestController
@RequestMapping("/api/resource-plans")
@Transactional
public class ResourcePlanResource {

    private final Logger log = LoggerFactory.getLogger(ResourcePlanResource.class);

    private static final String ENTITY_NAME = "resourcePlan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResourcePlanRepository resourcePlanRepository;

    public ResourcePlanResource(ResourcePlanRepository resourcePlanRepository) {
        this.resourcePlanRepository = resourcePlanRepository;
    }

    /**
     * {@code POST  /resource-plans} : Create a new resourcePlan.
     *
     * @param resourcePlan the resourcePlan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resourcePlan, or with status {@code 400 (Bad Request)} if the resourcePlan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ResourcePlan> createResourcePlan(@RequestBody ResourcePlan resourcePlan) throws URISyntaxException {
        log.debug("REST request to save ResourcePlan : {}", resourcePlan);
        if (resourcePlan.getId() != null) {
            throw new BadRequestAlertException("A new resourcePlan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResourcePlan result = resourcePlanRepository.save(resourcePlan);
        return ResponseEntity
            .created(new URI("/api/resource-plans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /resource-plans/:id} : Updates an existing resourcePlan.
     *
     * @param id the id of the resourcePlan to save.
     * @param resourcePlan the resourcePlan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourcePlan,
     * or with status {@code 400 (Bad Request)} if the resourcePlan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resourcePlan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourcePlan> updateResourcePlan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ResourcePlan resourcePlan
    ) throws URISyntaxException {
        log.debug("REST request to update ResourcePlan : {}, {}", id, resourcePlan);
        if (resourcePlan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourcePlan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourcePlanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ResourcePlan result = resourcePlanRepository.save(resourcePlan);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourcePlan.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /resource-plans/:id} : Partial updates given fields of an existing resourcePlan, field will ignore if it is null
     *
     * @param id the id of the resourcePlan to save.
     * @param resourcePlan the resourcePlan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourcePlan,
     * or with status {@code 400 (Bad Request)} if the resourcePlan is not valid,
     * or with status {@code 404 (Not Found)} if the resourcePlan is not found,
     * or with status {@code 500 (Internal Server Error)} if the resourcePlan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ResourcePlan> partialUpdateResourcePlan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ResourcePlan resourcePlan
    ) throws URISyntaxException {
        log.debug("REST request to partial update ResourcePlan partially : {}, {}", id, resourcePlan);
        if (resourcePlan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourcePlan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourcePlanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ResourcePlan> result = resourcePlanRepository
            .findById(resourcePlan.getId())
            .map(existingResourcePlan -> {
                if (resourcePlan.getAvailability() != null) {
                    existingResourcePlan.setAvailability(resourcePlan.getAvailability());
                }

                return existingResourcePlan;
            })
            .map(resourcePlanRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourcePlan.getId().toString())
        );
    }

    /**
     * {@code GET  /resource-plans} : get all the resourcePlans.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resourcePlans in body.
     */
    @GetMapping("")
    public List<ResourcePlan> getAllResourcePlans(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all ResourcePlans");
        if (eagerload) {
            return resourcePlanRepository.findAllWithEagerRelationships();
        } else {
            return resourcePlanRepository.findAll();
        }
    }

    /**
     * {@code GET  /resource-plans/:id} : get the "id" resourcePlan.
     *
     * @param id the id of the resourcePlan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resourcePlan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourcePlan> getResourcePlan(@PathVariable("id") Long id) {
        log.debug("REST request to get ResourcePlan : {}", id);
        Optional<ResourcePlan> resourcePlan = resourcePlanRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(resourcePlan);
    }

    /**
     * {@code DELETE  /resource-plans/:id} : delete the "id" resourcePlan.
     *
     * @param id the id of the resourcePlan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResourcePlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete ResourcePlan : {}", id);
        resourcePlanRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

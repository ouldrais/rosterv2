package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ResourceRoles;
import com.mycompany.myapp.repository.ResourceRolesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ResourceRoles}.
 */
@RestController
@RequestMapping("/api/resource-roles")
@Transactional
public class ResourceRolesResource {

    private final Logger log = LoggerFactory.getLogger(ResourceRolesResource.class);

    private static final String ENTITY_NAME = "resourceRoles";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResourceRolesRepository resourceRolesRepository;

    public ResourceRolesResource(ResourceRolesRepository resourceRolesRepository) {
        this.resourceRolesRepository = resourceRolesRepository;
    }

    /**
     * {@code POST  /resource-roles} : Create a new resourceRoles.
     *
     * @param resourceRoles the resourceRoles to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resourceRoles, or with status {@code 400 (Bad Request)} if the resourceRoles has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ResourceRoles> createResourceRoles(@RequestBody ResourceRoles resourceRoles) throws URISyntaxException {
        log.debug("REST request to save ResourceRoles : {}", resourceRoles);
        if (resourceRoles.getId() != null) {
            throw new BadRequestAlertException("A new resourceRoles cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ResourceRoles result = resourceRolesRepository.save(resourceRoles);
        return ResponseEntity
            .created(new URI("/api/resource-roles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /resource-roles/:id} : Updates an existing resourceRoles.
     *
     * @param id the id of the resourceRoles to save.
     * @param resourceRoles the resourceRoles to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourceRoles,
     * or with status {@code 400 (Bad Request)} if the resourceRoles is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resourceRoles couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceRoles> updateResourceRoles(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ResourceRoles resourceRoles
    ) throws URISyntaxException {
        log.debug("REST request to update ResourceRoles : {}, {}", id, resourceRoles);
        if (resourceRoles.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourceRoles.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourceRolesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ResourceRoles result = resourceRolesRepository.save(resourceRoles);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourceRoles.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /resource-roles/:id} : Partial updates given fields of an existing resourceRoles, field will ignore if it is null
     *
     * @param id the id of the resourceRoles to save.
     * @param resourceRoles the resourceRoles to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resourceRoles,
     * or with status {@code 400 (Bad Request)} if the resourceRoles is not valid,
     * or with status {@code 404 (Not Found)} if the resourceRoles is not found,
     * or with status {@code 500 (Internal Server Error)} if the resourceRoles couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ResourceRoles> partialUpdateResourceRoles(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ResourceRoles resourceRoles
    ) throws URISyntaxException {
        log.debug("REST request to partial update ResourceRoles partially : {}, {}", id, resourceRoles);
        if (resourceRoles.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resourceRoles.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resourceRolesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ResourceRoles> result = resourceRolesRepository.findById(resourceRoles.getId()).map(resourceRolesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resourceRoles.getId().toString())
        );
    }

    /**
     * {@code GET  /resource-roles} : get all the resourceRoles.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resourceRoles in body.
     */
    @GetMapping("")
    public List<ResourceRoles> getAllResourceRoles(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all ResourceRoles");
        if (eagerload) {
            return resourceRolesRepository.findAllWithEagerRelationships();
        } else {
            return resourceRolesRepository.findAll();
        }
    }

    /**
     * {@code GET  /resource-roles/:id} : get the "id" resourceRoles.
     *
     * @param id the id of the resourceRoles to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resourceRoles, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceRoles> getResourceRoles(@PathVariable("id") Long id) {
        log.debug("REST request to get ResourceRoles : {}", id);
        Optional<ResourceRoles> resourceRoles = resourceRolesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(resourceRoles);
    }

    /**
     * {@code DELETE  /resource-roles/:id} : delete the "id" resourceRoles.
     *
     * @param id the id of the resourceRoles to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResourceRoles(@PathVariable("id") Long id) {
        log.debug("REST request to delete ResourceRoles : {}", id);
        resourceRolesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

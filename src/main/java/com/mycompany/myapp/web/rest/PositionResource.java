package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Position;
import com.mycompany.myapp.repository.PositionRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Position}.
 */
@RestController
@RequestMapping("/api/positions")
@Transactional
public class PositionResource {

    private final Logger log = LoggerFactory.getLogger(PositionResource.class);

    private static final String ENTITY_NAME = "position";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PositionRepository positionRepository;

    public PositionResource(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    /**
     * {@code POST  /positions} : Create a new position.
     *
     * @param position the position to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new position, or with status {@code 400 (Bad Request)} if the position has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Position> createPosition(@RequestBody Position position) throws URISyntaxException {
        log.debug("REST request to save Position : {}", position);
        if (position.getId() != null) {
            throw new BadRequestAlertException("A new position cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Position result = positionRepository.save(position);
        return ResponseEntity
            .created(new URI("/api/positions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /positions/:id} : Updates an existing position.
     *
     * @param id the id of the position to save.
     * @param position the position to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated position,
     * or with status {@code 400 (Bad Request)} if the position is not valid,
     * or with status {@code 500 (Internal Server Error)} if the position couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Position> updatePosition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Position position
    ) throws URISyntaxException {
        log.debug("REST request to update Position : {}, {}", id, position);
        if (position.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, position.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!positionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Position result = positionRepository.save(position);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, position.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /positions/:id} : Partial updates given fields of an existing position, field will ignore if it is null
     *
     * @param id the id of the position to save.
     * @param position the position to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated position,
     * or with status {@code 400 (Bad Request)} if the position is not valid,
     * or with status {@code 404 (Not Found)} if the position is not found,
     * or with status {@code 500 (Internal Server Error)} if the position couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Position> partialUpdatePosition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Position position
    ) throws URISyntaxException {
        log.debug("REST request to partial update Position partially : {}, {}", id, position);
        if (position.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, position.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!positionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Position> result = positionRepository
            .findById(position.getId())
            .map(existingPosition -> {
                if (position.getKey() != null) {
                    existingPosition.setKey(position.getKey());
                }
                if (position.getLeadership() != null) {
                    existingPosition.setLeadership(position.getLeadership());
                }

                return existingPosition;
            })
            .map(positionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, position.getId().toString())
        );
    }

    /**
     * {@code GET  /positions} : get all the positions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of positions in body.
     */
    @GetMapping("")
    public List<Position> getAllPositions(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Positions");
        if (eagerload) {
            return positionRepository.findAllWithEagerRelationships();
        } else {
            return positionRepository.findAll();
        }
    }

    /**
     * {@code GET  /positions/:id} : get the "id" position.
     *
     * @param id the id of the position to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the position, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Position> getPosition(@PathVariable("id") Long id) {
        log.debug("REST request to get Position : {}", id);
        Optional<Position> position = positionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(position);
    }

    /**
     * {@code DELETE  /positions/:id} : delete the "id" position.
     *
     * @param id the id of the position to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable("id") Long id) {
        log.debug("REST request to delete Position : {}", id);
        positionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

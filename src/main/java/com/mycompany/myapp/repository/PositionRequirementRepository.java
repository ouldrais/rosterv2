package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PositionRequirement;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PositionRequirement entity.
 */
@Repository
public interface PositionRequirementRepository extends JpaRepository<PositionRequirement, Long> {
    default Optional<PositionRequirement> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<PositionRequirement> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<PositionRequirement> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select positionRequirement from PositionRequirement positionRequirement left join fetch positionRequirement.training left join fetch positionRequirement.position",
        countQuery = "select count(positionRequirement) from PositionRequirement positionRequirement"
    )
    Page<PositionRequirement> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select positionRequirement from PositionRequirement positionRequirement left join fetch positionRequirement.training left join fetch positionRequirement.position"
    )
    List<PositionRequirement> findAllWithToOneRelationships();

    @Query(
        "select positionRequirement from PositionRequirement positionRequirement left join fetch positionRequirement.training left join fetch positionRequirement.position where positionRequirement.id =:id"
    )
    Optional<PositionRequirement> findOneWithToOneRelationships(@Param("id") Long id);
}

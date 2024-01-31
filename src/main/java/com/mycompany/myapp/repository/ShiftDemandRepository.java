package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ShiftDemand;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ShiftDemand entity.
 */
@Repository
public interface ShiftDemandRepository extends JpaRepository<ShiftDemand, Long> {
    default Optional<ShiftDemand> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ShiftDemand> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ShiftDemand> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select shiftDemand from ShiftDemand shiftDemand left join fetch shiftDemand.shift left join fetch shiftDemand.task left join fetch shiftDemand.position left join fetch shiftDemand.department",
        countQuery = "select count(shiftDemand) from ShiftDemand shiftDemand"
    )
    Page<ShiftDemand> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select shiftDemand from ShiftDemand shiftDemand left join fetch shiftDemand.shift left join fetch shiftDemand.task left join fetch shiftDemand.position left join fetch shiftDemand.department"
    )
    List<ShiftDemand> findAllWithToOneRelationships();

    @Query(
        "select shiftDemand from ShiftDemand shiftDemand left join fetch shiftDemand.shift left join fetch shiftDemand.task left join fetch shiftDemand.position left join fetch shiftDemand.department where shiftDemand.id =:id"
    )
    Optional<ShiftDemand> findOneWithToOneRelationships(@Param("id") Long id);
}

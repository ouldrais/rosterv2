package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RefRotation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RefRotation entity.
 */
@Repository
public interface RefRotationRepository extends JpaRepository<RefRotation, Long> {
    default Optional<RefRotation> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<RefRotation> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<RefRotation> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select refRotation from RefRotation refRotation left join fetch refRotation.shiftType",
        countQuery = "select count(refRotation) from RefRotation refRotation"
    )
    Page<RefRotation> findAllWithToOneRelationships(Pageable pageable);

    @Query("select refRotation from RefRotation refRotation left join fetch refRotation.shiftType")
    List<RefRotation> findAllWithToOneRelationships();

    @Query("select refRotation from RefRotation refRotation left join fetch refRotation.shiftType where refRotation.id =:id")
    Optional<RefRotation> findOneWithToOneRelationships(@Param("id") Long id);
}

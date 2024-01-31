package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ResourcePlan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ResourcePlan entity.
 */
@Repository
public interface ResourcePlanRepository extends JpaRepository<ResourcePlan, Long> {
    default Optional<ResourcePlan> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ResourcePlan> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ResourcePlan> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select resourcePlan from ResourcePlan resourcePlan left join fetch resourcePlan.resource left join fetch resourcePlan.shift left join fetch resourcePlan.position",
        countQuery = "select count(resourcePlan) from ResourcePlan resourcePlan"
    )
    Page<ResourcePlan> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select resourcePlan from ResourcePlan resourcePlan left join fetch resourcePlan.resource left join fetch resourcePlan.shift left join fetch resourcePlan.position"
    )
    List<ResourcePlan> findAllWithToOneRelationships();

    @Query(
        "select resourcePlan from ResourcePlan resourcePlan left join fetch resourcePlan.resource left join fetch resourcePlan.shift left join fetch resourcePlan.position where resourcePlan.id =:id"
    )
    Optional<ResourcePlan> findOneWithToOneRelationships(@Param("id") Long id);
}

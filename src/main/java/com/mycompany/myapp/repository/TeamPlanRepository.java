package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TeamPlan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TeamPlan entity.
 */
@Repository
public interface TeamPlanRepository extends JpaRepository<TeamPlan, Long> {
    default Optional<TeamPlan> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TeamPlan> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TeamPlan> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select teamPlan from TeamPlan teamPlan left join fetch teamPlan.team left join fetch teamPlan.shift",
        countQuery = "select count(teamPlan) from TeamPlan teamPlan"
    )
    Page<TeamPlan> findAllWithToOneRelationships(Pageable pageable);

    @Query("select teamPlan from TeamPlan teamPlan left join fetch teamPlan.team left join fetch teamPlan.shift")
    List<TeamPlan> findAllWithToOneRelationships();

    @Query("select teamPlan from TeamPlan teamPlan left join fetch teamPlan.team left join fetch teamPlan.shift where teamPlan.id =:id")
    Optional<TeamPlan> findOneWithToOneRelationships(@Param("id") Long id);
}

package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ResourceRoles;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ResourceRoles entity.
 */
@Repository
public interface ResourceRolesRepository extends JpaRepository<ResourceRoles, Long> {
    default Optional<ResourceRoles> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ResourceRoles> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ResourceRoles> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select resourceRoles from ResourceRoles resourceRoles left join fetch resourceRoles.role left join fetch resourceRoles.resource",
        countQuery = "select count(resourceRoles) from ResourceRoles resourceRoles"
    )
    Page<ResourceRoles> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select resourceRoles from ResourceRoles resourceRoles left join fetch resourceRoles.role left join fetch resourceRoles.resource"
    )
    List<ResourceRoles> findAllWithToOneRelationships();

    @Query(
        "select resourceRoles from ResourceRoles resourceRoles left join fetch resourceRoles.role left join fetch resourceRoles.resource where resourceRoles.id =:id"
    )
    Optional<ResourceRoles> findOneWithToOneRelationships(@Param("id") Long id);
}

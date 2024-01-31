package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Resource;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Resource entity.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    default Optional<Resource> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Resource> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Resource> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select resource from Resource resource left join fetch resource.team",
        countQuery = "select count(resource) from Resource resource"
    )
    Page<Resource> findAllWithToOneRelationships(Pageable pageable);

    @Query("select resource from Resource resource left join fetch resource.team")
    List<Resource> findAllWithToOneRelationships();

    @Query("select resource from Resource resource left join fetch resource.team where resource.id =:id")
    Optional<Resource> findOneWithToOneRelationships(@Param("id") Long id);
}

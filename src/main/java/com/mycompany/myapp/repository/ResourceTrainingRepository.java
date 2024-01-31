package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ResourceTraining;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ResourceTraining entity.
 */
@Repository
public interface ResourceTrainingRepository extends JpaRepository<ResourceTraining, Long> {
    default Optional<ResourceTraining> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ResourceTraining> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ResourceTraining> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select resourceTraining from ResourceTraining resourceTraining left join fetch resourceTraining.resource left join fetch resourceTraining.training",
        countQuery = "select count(resourceTraining) from ResourceTraining resourceTraining"
    )
    Page<ResourceTraining> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select resourceTraining from ResourceTraining resourceTraining left join fetch resourceTraining.resource left join fetch resourceTraining.training"
    )
    List<ResourceTraining> findAllWithToOneRelationships();

    @Query(
        "select resourceTraining from ResourceTraining resourceTraining left join fetch resourceTraining.resource left join fetch resourceTraining.training where resourceTraining.id =:id"
    )
    Optional<ResourceTraining> findOneWithToOneRelationships(@Param("id") Long id);
}

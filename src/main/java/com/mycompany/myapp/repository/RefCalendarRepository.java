package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RefCalendar;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RefCalendar entity.
 */
@Repository
public interface RefCalendarRepository extends JpaRepository<RefCalendar, Long> {
    default Optional<RefCalendar> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<RefCalendar> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<RefCalendar> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select refCalendar from RefCalendar refCalendar left join fetch refCalendar.shiftType",
        countQuery = "select count(refCalendar) from RefCalendar refCalendar"
    )
    Page<RefCalendar> findAllWithToOneRelationships(Pageable pageable);

    @Query("select refCalendar from RefCalendar refCalendar left join fetch refCalendar.shiftType")
    List<RefCalendar> findAllWithToOneRelationships();

    @Query("select refCalendar from RefCalendar refCalendar left join fetch refCalendar.shiftType where refCalendar.id =:id")
    Optional<RefCalendar> findOneWithToOneRelationships(@Param("id") Long id);
}

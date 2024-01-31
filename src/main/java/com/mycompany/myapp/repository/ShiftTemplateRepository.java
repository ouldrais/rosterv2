package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ShiftTemplate;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ShiftTemplate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShiftTemplateRepository extends JpaRepository<ShiftTemplate, Long> {}

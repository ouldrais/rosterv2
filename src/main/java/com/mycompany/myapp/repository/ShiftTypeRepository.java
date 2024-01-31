package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ShiftType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ShiftType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShiftTypeRepository extends JpaRepository<ShiftType, Long> {}

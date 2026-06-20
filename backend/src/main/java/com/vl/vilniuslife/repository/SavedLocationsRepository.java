package com.vl.vilniuslife.repository;

import com.vl.vilniuslife.model.SavedLocations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SavedLocationsRepository extends JpaRepository<SavedLocations, SavedLocations.SavedLocationsId> {
    List<SavedLocations> findByUserId(Integer userId);
}

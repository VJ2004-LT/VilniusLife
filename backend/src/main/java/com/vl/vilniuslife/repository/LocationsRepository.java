package com.vl.vilniuslife.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vl.vilniuslife.model.Locations;

@Repository
public interface LocationsRepository extends JpaRepository<Locations, Integer> {

    @Query(value = "SELECT * FROM locations WHERE category = :category AND ST_X(geo) = :lng AND ST_Y(geo) = :lat LIMIT 1", nativeQuery = true)
    Optional<Locations> findByCategoryAndCoords(@Param("category") String category, @Param("lng") double lng, @Param("lat") double lat);
}
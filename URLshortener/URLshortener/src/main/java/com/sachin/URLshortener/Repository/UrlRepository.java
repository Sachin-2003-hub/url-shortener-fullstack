package com.sachin.URLshortener.Repository;

import com.sachin.URLshortener.Model.UrlEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UrlRepository extends JpaRepository<UrlEntity,Long> {
}

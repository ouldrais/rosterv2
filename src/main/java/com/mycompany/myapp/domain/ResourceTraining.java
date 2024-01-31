package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ResourceTraining.
 */
@Entity
@Table(name = "resource_training")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourceTraining implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "status")
    private String status;

    @Column(name = "level")
    private String level;

    @Column(name = "trainer")
    private String trainer;

    @Column(name = "active_from")
    private Instant activeFrom;

    @Column(name = "activeto")
    private Instant activeto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "team" }, allowSetters = true)
    private Resource resource;

    @ManyToOne(fetch = FetchType.LAZY)
    private Training training;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ResourceTraining id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return this.status;
    }

    public ResourceTraining status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLevel() {
        return this.level;
    }

    public ResourceTraining level(String level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getTrainer() {
        return this.trainer;
    }

    public ResourceTraining trainer(String trainer) {
        this.setTrainer(trainer);
        return this;
    }

    public void setTrainer(String trainer) {
        this.trainer = trainer;
    }

    public Instant getActiveFrom() {
        return this.activeFrom;
    }

    public ResourceTraining activeFrom(Instant activeFrom) {
        this.setActiveFrom(activeFrom);
        return this;
    }

    public void setActiveFrom(Instant activeFrom) {
        this.activeFrom = activeFrom;
    }

    public Instant getActiveto() {
        return this.activeto;
    }

    public ResourceTraining activeto(Instant activeto) {
        this.setActiveto(activeto);
        return this;
    }

    public void setActiveto(Instant activeto) {
        this.activeto = activeto;
    }

    public Resource getResource() {
        return this.resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public ResourceTraining resource(Resource resource) {
        this.setResource(resource);
        return this;
    }

    public Training getTraining() {
        return this.training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }

    public ResourceTraining training(Training training) {
        this.setTraining(training);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResourceTraining)) {
            return false;
        }
        return getId() != null && getId().equals(((ResourceTraining) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResourceTraining{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", level='" + getLevel() + "'" +
            ", trainer='" + getTrainer() + "'" +
            ", activeFrom='" + getActiveFrom() + "'" +
            ", activeto='" + getActiveto() + "'" +
            "}";
    }
}

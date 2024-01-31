package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PositionRequirement.
 */
@Entity
@Table(name = "position_requirement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PositionRequirement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "mandatoty")
    private String mandatoty;

    @ManyToOne(fetch = FetchType.LAZY)
    private Training training;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "department" }, allowSetters = true)
    private Position position;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PositionRequirement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMandatoty() {
        return this.mandatoty;
    }

    public PositionRequirement mandatoty(String mandatoty) {
        this.setMandatoty(mandatoty);
        return this;
    }

    public void setMandatoty(String mandatoty) {
        this.mandatoty = mandatoty;
    }

    public Training getTraining() {
        return this.training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }

    public PositionRequirement training(Training training) {
        this.setTraining(training);
        return this;
    }

    public Position getPosition() {
        return this.position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public PositionRequirement position(Position position) {
        this.setPosition(position);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PositionRequirement)) {
            return false;
        }
        return getId() != null && getId().equals(((PositionRequirement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PositionRequirement{" +
            "id=" + getId() +
            ", mandatoty='" + getMandatoty() + "'" +
            "}";
    }
}

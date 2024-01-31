package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ShiftTemplate.
 */
@Entity
@Table(name = "shift_template")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ShiftTemplate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "key")
    private Long key;

    @Column(name = "shift_start")
    private Instant shiftStart;

    @Column(name = "shift_end")
    private Instant shiftEnd;

    @Column(name = "type")
    private String type;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ShiftTemplate id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getKey() {
        return this.key;
    }

    public ShiftTemplate key(Long key) {
        this.setKey(key);
        return this;
    }

    public void setKey(Long key) {
        this.key = key;
    }

    public Instant getShiftStart() {
        return this.shiftStart;
    }

    public ShiftTemplate shiftStart(Instant shiftStart) {
        this.setShiftStart(shiftStart);
        return this;
    }

    public void setShiftStart(Instant shiftStart) {
        this.shiftStart = shiftStart;
    }

    public Instant getShiftEnd() {
        return this.shiftEnd;
    }

    public ShiftTemplate shiftEnd(Instant shiftEnd) {
        this.setShiftEnd(shiftEnd);
        return this;
    }

    public void setShiftEnd(Instant shiftEnd) {
        this.shiftEnd = shiftEnd;
    }

    public String getType() {
        return this.type;
    }

    public ShiftTemplate type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ShiftTemplate)) {
            return false;
        }
        return getId() != null && getId().equals(((ShiftTemplate) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShiftTemplate{" +
            "id=" + getId() +
            ", key=" + getKey() +
            ", shiftStart='" + getShiftStart() + "'" +
            ", shiftEnd='" + getShiftEnd() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}

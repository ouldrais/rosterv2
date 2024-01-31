package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ResourceTestSamples.*;
import static com.mycompany.myapp.domain.ResourceTrainingTestSamples.*;
import static com.mycompany.myapp.domain.TrainingTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResourceTrainingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourceTraining.class);
        ResourceTraining resourceTraining1 = getResourceTrainingSample1();
        ResourceTraining resourceTraining2 = new ResourceTraining();
        assertThat(resourceTraining1).isNotEqualTo(resourceTraining2);

        resourceTraining2.setId(resourceTraining1.getId());
        assertThat(resourceTraining1).isEqualTo(resourceTraining2);

        resourceTraining2 = getResourceTrainingSample2();
        assertThat(resourceTraining1).isNotEqualTo(resourceTraining2);
    }

    @Test
    void resourceTest() throws Exception {
        ResourceTraining resourceTraining = getResourceTrainingRandomSampleGenerator();
        Resource resourceBack = getResourceRandomSampleGenerator();

        resourceTraining.setResource(resourceBack);
        assertThat(resourceTraining.getResource()).isEqualTo(resourceBack);

        resourceTraining.resource(null);
        assertThat(resourceTraining.getResource()).isNull();
    }

    @Test
    void trainingTest() throws Exception {
        ResourceTraining resourceTraining = getResourceTrainingRandomSampleGenerator();
        Training trainingBack = getTrainingRandomSampleGenerator();

        resourceTraining.setTraining(trainingBack);
        assertThat(resourceTraining.getTraining()).isEqualTo(trainingBack);

        resourceTraining.training(null);
        assertThat(resourceTraining.getTraining()).isNull();
    }
}

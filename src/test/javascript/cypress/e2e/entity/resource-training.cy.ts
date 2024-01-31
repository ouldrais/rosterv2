import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('ResourceTraining e2e test', () => {
  const resourceTrainingPageUrl = '/resource-training';
  const resourceTrainingPageUrlPattern = new RegExp('/resource-training(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const resourceTrainingSample = {};

  let resourceTraining;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/resource-trainings+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/resource-trainings').as('postEntityRequest');
    cy.intercept('DELETE', '/api/resource-trainings/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (resourceTraining) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/resource-trainings/${resourceTraining.id}`,
      }).then(() => {
        resourceTraining = undefined;
      });
    }
  });

  it('ResourceTrainings menu should load ResourceTrainings page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('resource-training');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ResourceTraining').should('exist');
    cy.url().should('match', resourceTrainingPageUrlPattern);
  });

  describe('ResourceTraining page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(resourceTrainingPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ResourceTraining page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/resource-training/new$'));
        cy.getEntityCreateUpdateHeading('ResourceTraining');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceTrainingPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/resource-trainings',
          body: resourceTrainingSample,
        }).then(({ body }) => {
          resourceTraining = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/resource-trainings+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [resourceTraining],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(resourceTrainingPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ResourceTraining page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('resourceTraining');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceTrainingPageUrlPattern);
      });

      it('edit button click should load edit ResourceTraining page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ResourceTraining');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceTrainingPageUrlPattern);
      });

      it('edit button click should load edit ResourceTraining page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ResourceTraining');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceTrainingPageUrlPattern);
      });

      it('last delete button click should delete instance of ResourceTraining', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('resourceTraining').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceTrainingPageUrlPattern);

        resourceTraining = undefined;
      });
    });
  });

  describe('new ResourceTraining page', () => {
    beforeEach(() => {
      cy.visit(`${resourceTrainingPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ResourceTraining');
    });

    it('should create an instance of ResourceTraining', () => {
      cy.get(`[data-cy="status"]`).type('decriminalise yum muse');
      cy.get(`[data-cy="status"]`).should('have.value', 'decriminalise yum muse');

      cy.get(`[data-cy="level"]`).type('huzzah');
      cy.get(`[data-cy="level"]`).should('have.value', 'huzzah');

      cy.get(`[data-cy="trainer"]`).type('instead');
      cy.get(`[data-cy="trainer"]`).should('have.value', 'instead');

      cy.get(`[data-cy="activeFrom"]`).type('2024-01-31T21:25');
      cy.get(`[data-cy="activeFrom"]`).blur();
      cy.get(`[data-cy="activeFrom"]`).should('have.value', '2024-01-31T21:25');

      cy.get(`[data-cy="activeto"]`).type('2024-01-31T11:40');
      cy.get(`[data-cy="activeto"]`).blur();
      cy.get(`[data-cy="activeto"]`).should('have.value', '2024-01-31T11:40');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        resourceTraining = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', resourceTrainingPageUrlPattern);
    });
  });
});

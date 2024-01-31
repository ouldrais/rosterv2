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

describe('Training e2e test', () => {
  const trainingPageUrl = '/training';
  const trainingPageUrlPattern = new RegExp('/training(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const trainingSample = {};

  let training;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/trainings+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/trainings').as('postEntityRequest');
    cy.intercept('DELETE', '/api/trainings/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (training) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/trainings/${training.id}`,
      }).then(() => {
        training = undefined;
      });
    }
  });

  it('Trainings menu should load Trainings page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('training');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Training').should('exist');
    cy.url().should('match', trainingPageUrlPattern);
  });

  describe('Training page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(trainingPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Training page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/training/new$'));
        cy.getEntityCreateUpdateHeading('Training');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trainingPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/trainings',
          body: trainingSample,
        }).then(({ body }) => {
          training = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/trainings+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [training],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(trainingPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Training page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('training');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trainingPageUrlPattern);
      });

      it('edit button click should load edit Training page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Training');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trainingPageUrlPattern);
      });

      it('edit button click should load edit Training page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Training');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trainingPageUrlPattern);
      });

      it('last delete button click should delete instance of Training', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('training').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trainingPageUrlPattern);

        training = undefined;
      });
    });
  });

  describe('new Training page', () => {
    beforeEach(() => {
      cy.visit(`${trainingPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Training');
    });

    it('should create an instance of Training', () => {
      cy.get(`[data-cy="key"]`).type('21193');
      cy.get(`[data-cy="key"]`).should('have.value', '21193');

      cy.get(`[data-cy="description"]`).type('lumberman hastily psst');
      cy.get(`[data-cy="description"]`).should('have.value', 'lumberman hastily psst');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        training = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', trainingPageUrlPattern);
    });
  });
});

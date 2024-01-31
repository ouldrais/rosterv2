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

describe('ResourcePlan e2e test', () => {
  const resourcePlanPageUrl = '/resource-plan';
  const resourcePlanPageUrlPattern = new RegExp('/resource-plan(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const resourcePlanSample = {};

  let resourcePlan;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/resource-plans+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/resource-plans').as('postEntityRequest');
    cy.intercept('DELETE', '/api/resource-plans/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (resourcePlan) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/resource-plans/${resourcePlan.id}`,
      }).then(() => {
        resourcePlan = undefined;
      });
    }
  });

  it('ResourcePlans menu should load ResourcePlans page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('resource-plan');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ResourcePlan').should('exist');
    cy.url().should('match', resourcePlanPageUrlPattern);
  });

  describe('ResourcePlan page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(resourcePlanPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ResourcePlan page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/resource-plan/new$'));
        cy.getEntityCreateUpdateHeading('ResourcePlan');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourcePlanPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/resource-plans',
          body: resourcePlanSample,
        }).then(({ body }) => {
          resourcePlan = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/resource-plans+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [resourcePlan],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(resourcePlanPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ResourcePlan page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('resourcePlan');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourcePlanPageUrlPattern);
      });

      it('edit button click should load edit ResourcePlan page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ResourcePlan');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourcePlanPageUrlPattern);
      });

      it('edit button click should load edit ResourcePlan page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ResourcePlan');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourcePlanPageUrlPattern);
      });

      it('last delete button click should delete instance of ResourcePlan', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('resourcePlan').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourcePlanPageUrlPattern);

        resourcePlan = undefined;
      });
    });
  });

  describe('new ResourcePlan page', () => {
    beforeEach(() => {
      cy.visit(`${resourcePlanPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ResourcePlan');
    });

    it('should create an instance of ResourcePlan', () => {
      cy.get(`[data-cy="availability"]`).should('not.be.checked');
      cy.get(`[data-cy="availability"]`).click();
      cy.get(`[data-cy="availability"]`).should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        resourcePlan = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', resourcePlanPageUrlPattern);
    });
  });
});

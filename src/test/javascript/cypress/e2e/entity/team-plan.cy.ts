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

describe('TeamPlan e2e test', () => {
  const teamPlanPageUrl = '/team-plan';
  const teamPlanPageUrlPattern = new RegExp('/team-plan(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const teamPlanSample = {};

  let teamPlan;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/team-plans+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/team-plans').as('postEntityRequest');
    cy.intercept('DELETE', '/api/team-plans/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (teamPlan) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/team-plans/${teamPlan.id}`,
      }).then(() => {
        teamPlan = undefined;
      });
    }
  });

  it('TeamPlans menu should load TeamPlans page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('team-plan');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TeamPlan').should('exist');
    cy.url().should('match', teamPlanPageUrlPattern);
  });

  describe('TeamPlan page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(teamPlanPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TeamPlan page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/team-plan/new$'));
        cy.getEntityCreateUpdateHeading('TeamPlan');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPlanPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/team-plans',
          body: teamPlanSample,
        }).then(({ body }) => {
          teamPlan = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/team-plans+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [teamPlan],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(teamPlanPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TeamPlan page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('teamPlan');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPlanPageUrlPattern);
      });

      it('edit button click should load edit TeamPlan page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TeamPlan');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPlanPageUrlPattern);
      });

      it('edit button click should load edit TeamPlan page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TeamPlan');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPlanPageUrlPattern);
      });

      it('last delete button click should delete instance of TeamPlan', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('teamPlan').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPlanPageUrlPattern);

        teamPlan = undefined;
      });
    });
  });

  describe('new TeamPlan page', () => {
    beforeEach(() => {
      cy.visit(`${teamPlanPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TeamPlan');
    });

    it('should create an instance of TeamPlan', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        teamPlan = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', teamPlanPageUrlPattern);
    });
  });
});

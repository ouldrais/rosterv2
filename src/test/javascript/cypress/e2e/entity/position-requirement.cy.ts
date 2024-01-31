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

describe('PositionRequirement e2e test', () => {
  const positionRequirementPageUrl = '/position-requirement';
  const positionRequirementPageUrlPattern = new RegExp('/position-requirement(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const positionRequirementSample = {};

  let positionRequirement;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/position-requirements+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/position-requirements').as('postEntityRequest');
    cy.intercept('DELETE', '/api/position-requirements/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (positionRequirement) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/position-requirements/${positionRequirement.id}`,
      }).then(() => {
        positionRequirement = undefined;
      });
    }
  });

  it('PositionRequirements menu should load PositionRequirements page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('position-requirement');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PositionRequirement').should('exist');
    cy.url().should('match', positionRequirementPageUrlPattern);
  });

  describe('PositionRequirement page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(positionRequirementPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PositionRequirement page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/position-requirement/new$'));
        cy.getEntityCreateUpdateHeading('PositionRequirement');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', positionRequirementPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/position-requirements',
          body: positionRequirementSample,
        }).then(({ body }) => {
          positionRequirement = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/position-requirements+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [positionRequirement],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(positionRequirementPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PositionRequirement page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('positionRequirement');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', positionRequirementPageUrlPattern);
      });

      it('edit button click should load edit PositionRequirement page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PositionRequirement');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', positionRequirementPageUrlPattern);
      });

      it('edit button click should load edit PositionRequirement page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PositionRequirement');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', positionRequirementPageUrlPattern);
      });

      it('last delete button click should delete instance of PositionRequirement', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('positionRequirement').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', positionRequirementPageUrlPattern);

        positionRequirement = undefined;
      });
    });
  });

  describe('new PositionRequirement page', () => {
    beforeEach(() => {
      cy.visit(`${positionRequirementPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PositionRequirement');
    });

    it('should create an instance of PositionRequirement', () => {
      cy.get(`[data-cy="mandatoty"]`).type('yum until');
      cy.get(`[data-cy="mandatoty"]`).should('have.value', 'yum until');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        positionRequirement = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', positionRequirementPageUrlPattern);
    });
  });
});

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

describe('ShiftDemand e2e test', () => {
  const shiftDemandPageUrl = '/shift-demand';
  const shiftDemandPageUrlPattern = new RegExp('/shift-demand(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const shiftDemandSample = {};

  let shiftDemand;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/shift-demands+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/shift-demands').as('postEntityRequest');
    cy.intercept('DELETE', '/api/shift-demands/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (shiftDemand) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/shift-demands/${shiftDemand.id}`,
      }).then(() => {
        shiftDemand = undefined;
      });
    }
  });

  it('ShiftDemands menu should load ShiftDemands page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shift-demand');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ShiftDemand').should('exist');
    cy.url().should('match', shiftDemandPageUrlPattern);
  });

  describe('ShiftDemand page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(shiftDemandPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ShiftDemand page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/shift-demand/new$'));
        cy.getEntityCreateUpdateHeading('ShiftDemand');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftDemandPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/shift-demands',
          body: shiftDemandSample,
        }).then(({ body }) => {
          shiftDemand = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/shift-demands+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [shiftDemand],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(shiftDemandPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ShiftDemand page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('shiftDemand');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftDemandPageUrlPattern);
      });

      it('edit button click should load edit ShiftDemand page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ShiftDemand');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftDemandPageUrlPattern);
      });

      it('edit button click should load edit ShiftDemand page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ShiftDemand');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftDemandPageUrlPattern);
      });

      it('last delete button click should delete instance of ShiftDemand', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('shiftDemand').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftDemandPageUrlPattern);

        shiftDemand = undefined;
      });
    });
  });

  describe('new ShiftDemand page', () => {
    beforeEach(() => {
      cy.visit(`${shiftDemandPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ShiftDemand');
    });

    it('should create an instance of ShiftDemand', () => {
      cy.get(`[data-cy="count"]`).type('17325');
      cy.get(`[data-cy="count"]`).should('have.value', '17325');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        shiftDemand = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', shiftDemandPageUrlPattern);
    });
  });
});

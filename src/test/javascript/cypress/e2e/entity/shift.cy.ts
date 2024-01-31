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

describe('Shift e2e test', () => {
  const shiftPageUrl = '/shift';
  const shiftPageUrlPattern = new RegExp('/shift(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const shiftSample = {};

  let shift;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/shifts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/shifts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/shifts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (shift) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/shifts/${shift.id}`,
      }).then(() => {
        shift = undefined;
      });
    }
  });

  it('Shifts menu should load Shifts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shift');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Shift').should('exist');
    cy.url().should('match', shiftPageUrlPattern);
  });

  describe('Shift page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(shiftPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Shift page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/shift/new$'));
        cy.getEntityCreateUpdateHeading('Shift');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/shifts',
          body: shiftSample,
        }).then(({ body }) => {
          shift = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/shifts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [shift],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(shiftPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Shift page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('shift');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftPageUrlPattern);
      });

      it('edit button click should load edit Shift page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Shift');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftPageUrlPattern);
      });

      it('edit button click should load edit Shift page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Shift');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftPageUrlPattern);
      });

      it('last delete button click should delete instance of Shift', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('shift').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftPageUrlPattern);

        shift = undefined;
      });
    });
  });

  describe('new Shift page', () => {
    beforeEach(() => {
      cy.visit(`${shiftPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Shift');
    });

    it('should create an instance of Shift', () => {
      cy.get(`[data-cy="key"]`).type('5884');
      cy.get(`[data-cy="key"]`).should('have.value', '5884');

      cy.get(`[data-cy="shiftStart"]`).type('2024-01-31T17:21');
      cy.get(`[data-cy="shiftStart"]`).blur();
      cy.get(`[data-cy="shiftStart"]`).should('have.value', '2024-01-31T17:21');

      cy.get(`[data-cy="shiftEnd"]`).type('2024-01-31T05:04');
      cy.get(`[data-cy="shiftEnd"]`).blur();
      cy.get(`[data-cy="shiftEnd"]`).should('have.value', '2024-01-31T05:04');

      cy.get(`[data-cy="type"]`).type('ah which sympathetically');
      cy.get(`[data-cy="type"]`).should('have.value', 'ah which sympathetically');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        shift = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', shiftPageUrlPattern);
    });
  });
});

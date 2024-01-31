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

describe('ShiftType e2e test', () => {
  const shiftTypePageUrl = '/shift-type';
  const shiftTypePageUrlPattern = new RegExp('/shift-type(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const shiftTypeSample = {};

  let shiftType;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/shift-types+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/shift-types').as('postEntityRequest');
    cy.intercept('DELETE', '/api/shift-types/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (shiftType) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/shift-types/${shiftType.id}`,
      }).then(() => {
        shiftType = undefined;
      });
    }
  });

  it('ShiftTypes menu should load ShiftTypes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shift-type');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ShiftType').should('exist');
    cy.url().should('match', shiftTypePageUrlPattern);
  });

  describe('ShiftType page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(shiftTypePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ShiftType page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/shift-type/new$'));
        cy.getEntityCreateUpdateHeading('ShiftType');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTypePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/shift-types',
          body: shiftTypeSample,
        }).then(({ body }) => {
          shiftType = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/shift-types+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [shiftType],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(shiftTypePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ShiftType page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('shiftType');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTypePageUrlPattern);
      });

      it('edit button click should load edit ShiftType page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ShiftType');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTypePageUrlPattern);
      });

      it('edit button click should load edit ShiftType page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ShiftType');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTypePageUrlPattern);
      });

      it('last delete button click should delete instance of ShiftType', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('shiftType').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTypePageUrlPattern);

        shiftType = undefined;
      });
    });
  });

  describe('new ShiftType page', () => {
    beforeEach(() => {
      cy.visit(`${shiftTypePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ShiftType');
    });

    it('should create an instance of ShiftType', () => {
      cy.get(`[data-cy="key"]`).type('7131');
      cy.get(`[data-cy="key"]`).should('have.value', '7131');

      cy.get(`[data-cy="start"]`).type('2024-01-31T03:11');
      cy.get(`[data-cy="start"]`).blur();
      cy.get(`[data-cy="start"]`).should('have.value', '2024-01-31T03:11');

      cy.get(`[data-cy="end"]`).type('2024-01-31T23:03');
      cy.get(`[data-cy="end"]`).blur();
      cy.get(`[data-cy="end"]`).should('have.value', '2024-01-31T23:03');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        shiftType = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', shiftTypePageUrlPattern);
    });
  });
});

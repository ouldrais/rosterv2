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

describe('RefRotation e2e test', () => {
  const refRotationPageUrl = '/ref-rotation';
  const refRotationPageUrlPattern = new RegExp('/ref-rotation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const refRotationSample = {};

  let refRotation;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ref-rotations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ref-rotations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ref-rotations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (refRotation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ref-rotations/${refRotation.id}`,
      }).then(() => {
        refRotation = undefined;
      });
    }
  });

  it('RefRotations menu should load RefRotations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ref-rotation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('RefRotation').should('exist');
    cy.url().should('match', refRotationPageUrlPattern);
  });

  describe('RefRotation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(refRotationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create RefRotation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ref-rotation/new$'));
        cy.getEntityCreateUpdateHeading('RefRotation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refRotationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ref-rotations',
          body: refRotationSample,
        }).then(({ body }) => {
          refRotation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ref-rotations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [refRotation],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(refRotationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details RefRotation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('refRotation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refRotationPageUrlPattern);
      });

      it('edit button click should load edit RefRotation page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RefRotation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refRotationPageUrlPattern);
      });

      it('edit button click should load edit RefRotation page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RefRotation');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refRotationPageUrlPattern);
      });

      it('last delete button click should delete instance of RefRotation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('refRotation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refRotationPageUrlPattern);

        refRotation = undefined;
      });
    });
  });

  describe('new RefRotation page', () => {
    beforeEach(() => {
      cy.visit(`${refRotationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('RefRotation');
    });

    it('should create an instance of RefRotation', () => {
      cy.get(`[data-cy="order"]`).type('3962');
      cy.get(`[data-cy="order"]`).should('have.value', '3962');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        refRotation = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', refRotationPageUrlPattern);
    });
  });
});

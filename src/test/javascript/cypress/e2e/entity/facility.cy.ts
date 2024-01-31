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

describe('Facility e2e test', () => {
  const facilityPageUrl = '/facility';
  const facilityPageUrlPattern = new RegExp('/facility(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const facilitySample = {};

  let facility;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/facilities+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/facilities').as('postEntityRequest');
    cy.intercept('DELETE', '/api/facilities/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (facility) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/facilities/${facility.id}`,
      }).then(() => {
        facility = undefined;
      });
    }
  });

  it('Facilities menu should load Facilities page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('facility');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Facility').should('exist');
    cy.url().should('match', facilityPageUrlPattern);
  });

  describe('Facility page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(facilityPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Facility page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/facility/new$'));
        cy.getEntityCreateUpdateHeading('Facility');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facilityPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/facilities',
          body: facilitySample,
        }).then(({ body }) => {
          facility = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/facilities+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [facility],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(facilityPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Facility page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('facility');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facilityPageUrlPattern);
      });

      it('edit button click should load edit Facility page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Facility');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facilityPageUrlPattern);
      });

      it('edit button click should load edit Facility page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Facility');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facilityPageUrlPattern);
      });

      it('last delete button click should delete instance of Facility', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('facility').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', facilityPageUrlPattern);

        facility = undefined;
      });
    });
  });

  describe('new Facility page', () => {
    beforeEach(() => {
      cy.visit(`${facilityPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Facility');
    });

    it('should create an instance of Facility', () => {
      cy.get(`[data-cy="key"]`).type('29616');
      cy.get(`[data-cy="key"]`).should('have.value', '29616');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        facility = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', facilityPageUrlPattern);
    });
  });
});

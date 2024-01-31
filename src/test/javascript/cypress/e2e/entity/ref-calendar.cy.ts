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

describe('RefCalendar e2e test', () => {
  const refCalendarPageUrl = '/ref-calendar';
  const refCalendarPageUrlPattern = new RegExp('/ref-calendar(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const refCalendarSample = {};

  let refCalendar;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ref-calendars+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ref-calendars').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ref-calendars/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (refCalendar) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ref-calendars/${refCalendar.id}`,
      }).then(() => {
        refCalendar = undefined;
      });
    }
  });

  it('RefCalendars menu should load RefCalendars page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ref-calendar');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('RefCalendar').should('exist');
    cy.url().should('match', refCalendarPageUrlPattern);
  });

  describe('RefCalendar page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(refCalendarPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create RefCalendar page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ref-calendar/new$'));
        cy.getEntityCreateUpdateHeading('RefCalendar');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refCalendarPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ref-calendars',
          body: refCalendarSample,
        }).then(({ body }) => {
          refCalendar = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ref-calendars+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [refCalendar],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(refCalendarPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details RefCalendar page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('refCalendar');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refCalendarPageUrlPattern);
      });

      it('edit button click should load edit RefCalendar page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RefCalendar');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refCalendarPageUrlPattern);
      });

      it('edit button click should load edit RefCalendar page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RefCalendar');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refCalendarPageUrlPattern);
      });

      it('last delete button click should delete instance of RefCalendar', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('refCalendar').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', refCalendarPageUrlPattern);

        refCalendar = undefined;
      });
    });
  });

  describe('new RefCalendar page', () => {
    beforeEach(() => {
      cy.visit(`${refCalendarPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('RefCalendar');
    });

    it('should create an instance of RefCalendar', () => {
      cy.get(`[data-cy="key"]`).type('15036');
      cy.get(`[data-cy="key"]`).should('have.value', '15036');

      cy.get(`[data-cy="status"]`).type('ha');
      cy.get(`[data-cy="status"]`).should('have.value', 'ha');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        refCalendar = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', refCalendarPageUrlPattern);
    });
  });
});

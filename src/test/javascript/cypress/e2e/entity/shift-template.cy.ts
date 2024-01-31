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

describe('ShiftTemplate e2e test', () => {
  const shiftTemplatePageUrl = '/shift-template';
  const shiftTemplatePageUrlPattern = new RegExp('/shift-template(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const shiftTemplateSample = {};

  let shiftTemplate;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/shift-templates+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/shift-templates').as('postEntityRequest');
    cy.intercept('DELETE', '/api/shift-templates/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (shiftTemplate) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/shift-templates/${shiftTemplate.id}`,
      }).then(() => {
        shiftTemplate = undefined;
      });
    }
  });

  it('ShiftTemplates menu should load ShiftTemplates page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shift-template');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ShiftTemplate').should('exist');
    cy.url().should('match', shiftTemplatePageUrlPattern);
  });

  describe('ShiftTemplate page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(shiftTemplatePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ShiftTemplate page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/shift-template/new$'));
        cy.getEntityCreateUpdateHeading('ShiftTemplate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTemplatePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/shift-templates',
          body: shiftTemplateSample,
        }).then(({ body }) => {
          shiftTemplate = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/shift-templates+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [shiftTemplate],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(shiftTemplatePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ShiftTemplate page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('shiftTemplate');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTemplatePageUrlPattern);
      });

      it('edit button click should load edit ShiftTemplate page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ShiftTemplate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTemplatePageUrlPattern);
      });

      it('edit button click should load edit ShiftTemplate page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ShiftTemplate');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTemplatePageUrlPattern);
      });

      it('last delete button click should delete instance of ShiftTemplate', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('shiftTemplate').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shiftTemplatePageUrlPattern);

        shiftTemplate = undefined;
      });
    });
  });

  describe('new ShiftTemplate page', () => {
    beforeEach(() => {
      cy.visit(`${shiftTemplatePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ShiftTemplate');
    });

    it('should create an instance of ShiftTemplate', () => {
      cy.get(`[data-cy="key"]`).type('21429');
      cy.get(`[data-cy="key"]`).should('have.value', '21429');

      cy.get(`[data-cy="shiftStart"]`).type('2024-01-31T19:45');
      cy.get(`[data-cy="shiftStart"]`).blur();
      cy.get(`[data-cy="shiftStart"]`).should('have.value', '2024-01-31T19:45');

      cy.get(`[data-cy="shiftEnd"]`).type('2024-01-31T18:38');
      cy.get(`[data-cy="shiftEnd"]`).blur();
      cy.get(`[data-cy="shiftEnd"]`).should('have.value', '2024-01-31T18:38');

      cy.get(`[data-cy="type"]`).type('beautiful');
      cy.get(`[data-cy="type"]`).should('have.value', 'beautiful');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        shiftTemplate = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', shiftTemplatePageUrlPattern);
    });
  });
});

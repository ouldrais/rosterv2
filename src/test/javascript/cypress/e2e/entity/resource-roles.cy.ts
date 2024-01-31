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

describe('ResourceRoles e2e test', () => {
  const resourceRolesPageUrl = '/resource-roles';
  const resourceRolesPageUrlPattern = new RegExp('/resource-roles(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const resourceRolesSample = {};

  let resourceRoles;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/resource-roles+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/resource-roles').as('postEntityRequest');
    cy.intercept('DELETE', '/api/resource-roles/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (resourceRoles) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/resource-roles/${resourceRoles.id}`,
      }).then(() => {
        resourceRoles = undefined;
      });
    }
  });

  it('ResourceRoles menu should load ResourceRoles page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('resource-roles');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ResourceRoles').should('exist');
    cy.url().should('match', resourceRolesPageUrlPattern);
  });

  describe('ResourceRoles page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(resourceRolesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ResourceRoles page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/resource-roles/new$'));
        cy.getEntityCreateUpdateHeading('ResourceRoles');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceRolesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/resource-roles',
          body: resourceRolesSample,
        }).then(({ body }) => {
          resourceRoles = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/resource-roles+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [resourceRoles],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(resourceRolesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ResourceRoles page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('resourceRoles');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceRolesPageUrlPattern);
      });

      it('edit button click should load edit ResourceRoles page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ResourceRoles');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceRolesPageUrlPattern);
      });

      it('edit button click should load edit ResourceRoles page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ResourceRoles');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceRolesPageUrlPattern);
      });

      it('last delete button click should delete instance of ResourceRoles', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('resourceRoles').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', resourceRolesPageUrlPattern);

        resourceRoles = undefined;
      });
    });
  });

  describe('new ResourceRoles page', () => {
    beforeEach(() => {
      cy.visit(`${resourceRolesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ResourceRoles');
    });

    it('should create an instance of ResourceRoles', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        resourceRoles = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', resourceRolesPageUrlPattern);
    });
  });
});

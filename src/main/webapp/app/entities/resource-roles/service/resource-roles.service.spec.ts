import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResourceRoles } from '../resource-roles.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../resource-roles.test-samples';

import { ResourceRolesService } from './resource-roles.service';

const requireRestSample: IResourceRoles = {
  ...sampleWithRequiredData,
};

describe('ResourceRoles Service', () => {
  let service: ResourceRolesService;
  let httpMock: HttpTestingController;
  let expectedResult: IResourceRoles | IResourceRoles[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResourceRolesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ResourceRoles', () => {
      const resourceRoles = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resourceRoles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ResourceRoles', () => {
      const resourceRoles = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resourceRoles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ResourceRoles', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ResourceRoles', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ResourceRoles', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addResourceRolesToCollectionIfMissing', () => {
      it('should add a ResourceRoles to an empty array', () => {
        const resourceRoles: IResourceRoles = sampleWithRequiredData;
        expectedResult = service.addResourceRolesToCollectionIfMissing([], resourceRoles);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resourceRoles);
      });

      it('should not add a ResourceRoles to an array that contains it', () => {
        const resourceRoles: IResourceRoles = sampleWithRequiredData;
        const resourceRolesCollection: IResourceRoles[] = [
          {
            ...resourceRoles,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResourceRolesToCollectionIfMissing(resourceRolesCollection, resourceRoles);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ResourceRoles to an array that doesn't contain it", () => {
        const resourceRoles: IResourceRoles = sampleWithRequiredData;
        const resourceRolesCollection: IResourceRoles[] = [sampleWithPartialData];
        expectedResult = service.addResourceRolesToCollectionIfMissing(resourceRolesCollection, resourceRoles);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resourceRoles);
      });

      it('should add only unique ResourceRoles to an array', () => {
        const resourceRolesArray: IResourceRoles[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const resourceRolesCollection: IResourceRoles[] = [sampleWithRequiredData];
        expectedResult = service.addResourceRolesToCollectionIfMissing(resourceRolesCollection, ...resourceRolesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resourceRoles: IResourceRoles = sampleWithRequiredData;
        const resourceRoles2: IResourceRoles = sampleWithPartialData;
        expectedResult = service.addResourceRolesToCollectionIfMissing([], resourceRoles, resourceRoles2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resourceRoles);
        expect(expectedResult).toContain(resourceRoles2);
      });

      it('should accept null and undefined values', () => {
        const resourceRoles: IResourceRoles = sampleWithRequiredData;
        expectedResult = service.addResourceRolesToCollectionIfMissing([], null, resourceRoles, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resourceRoles);
      });

      it('should return initial array if no ResourceRoles is added', () => {
        const resourceRolesCollection: IResourceRoles[] = [sampleWithRequiredData];
        expectedResult = service.addResourceRolesToCollectionIfMissing(resourceRolesCollection, undefined, null);
        expect(expectedResult).toEqual(resourceRolesCollection);
      });
    });

    describe('compareResourceRoles', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResourceRoles(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareResourceRoles(entity1, entity2);
        const compareResult2 = service.compareResourceRoles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareResourceRoles(entity1, entity2);
        const compareResult2 = service.compareResourceRoles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareResourceRoles(entity1, entity2);
        const compareResult2 = service.compareResourceRoles(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

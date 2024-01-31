import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResourcePlan } from '../resource-plan.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../resource-plan.test-samples';

import { ResourcePlanService } from './resource-plan.service';

const requireRestSample: IResourcePlan = {
  ...sampleWithRequiredData,
};

describe('ResourcePlan Service', () => {
  let service: ResourcePlanService;
  let httpMock: HttpTestingController;
  let expectedResult: IResourcePlan | IResourcePlan[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResourcePlanService);
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

    it('should create a ResourcePlan', () => {
      const resourcePlan = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resourcePlan).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ResourcePlan', () => {
      const resourcePlan = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resourcePlan).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ResourcePlan', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ResourcePlan', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ResourcePlan', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addResourcePlanToCollectionIfMissing', () => {
      it('should add a ResourcePlan to an empty array', () => {
        const resourcePlan: IResourcePlan = sampleWithRequiredData;
        expectedResult = service.addResourcePlanToCollectionIfMissing([], resourcePlan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resourcePlan);
      });

      it('should not add a ResourcePlan to an array that contains it', () => {
        const resourcePlan: IResourcePlan = sampleWithRequiredData;
        const resourcePlanCollection: IResourcePlan[] = [
          {
            ...resourcePlan,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResourcePlanToCollectionIfMissing(resourcePlanCollection, resourcePlan);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ResourcePlan to an array that doesn't contain it", () => {
        const resourcePlan: IResourcePlan = sampleWithRequiredData;
        const resourcePlanCollection: IResourcePlan[] = [sampleWithPartialData];
        expectedResult = service.addResourcePlanToCollectionIfMissing(resourcePlanCollection, resourcePlan);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resourcePlan);
      });

      it('should add only unique ResourcePlan to an array', () => {
        const resourcePlanArray: IResourcePlan[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const resourcePlanCollection: IResourcePlan[] = [sampleWithRequiredData];
        expectedResult = service.addResourcePlanToCollectionIfMissing(resourcePlanCollection, ...resourcePlanArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resourcePlan: IResourcePlan = sampleWithRequiredData;
        const resourcePlan2: IResourcePlan = sampleWithPartialData;
        expectedResult = service.addResourcePlanToCollectionIfMissing([], resourcePlan, resourcePlan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resourcePlan);
        expect(expectedResult).toContain(resourcePlan2);
      });

      it('should accept null and undefined values', () => {
        const resourcePlan: IResourcePlan = sampleWithRequiredData;
        expectedResult = service.addResourcePlanToCollectionIfMissing([], null, resourcePlan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resourcePlan);
      });

      it('should return initial array if no ResourcePlan is added', () => {
        const resourcePlanCollection: IResourcePlan[] = [sampleWithRequiredData];
        expectedResult = service.addResourcePlanToCollectionIfMissing(resourcePlanCollection, undefined, null);
        expect(expectedResult).toEqual(resourcePlanCollection);
      });
    });

    describe('compareResourcePlan', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResourcePlan(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareResourcePlan(entity1, entity2);
        const compareResult2 = service.compareResourcePlan(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareResourcePlan(entity1, entity2);
        const compareResult2 = service.compareResourcePlan(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareResourcePlan(entity1, entity2);
        const compareResult2 = service.compareResourcePlan(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

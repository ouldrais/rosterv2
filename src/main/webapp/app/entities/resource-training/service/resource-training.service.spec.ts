import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResourceTraining } from '../resource-training.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../resource-training.test-samples';

import { ResourceTrainingService, RestResourceTraining } from './resource-training.service';

const requireRestSample: RestResourceTraining = {
  ...sampleWithRequiredData,
  activeFrom: sampleWithRequiredData.activeFrom?.toJSON(),
  activeto: sampleWithRequiredData.activeto?.toJSON(),
};

describe('ResourceTraining Service', () => {
  let service: ResourceTrainingService;
  let httpMock: HttpTestingController;
  let expectedResult: IResourceTraining | IResourceTraining[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResourceTrainingService);
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

    it('should create a ResourceTraining', () => {
      const resourceTraining = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resourceTraining).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ResourceTraining', () => {
      const resourceTraining = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resourceTraining).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ResourceTraining', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ResourceTraining', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ResourceTraining', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addResourceTrainingToCollectionIfMissing', () => {
      it('should add a ResourceTraining to an empty array', () => {
        const resourceTraining: IResourceTraining = sampleWithRequiredData;
        expectedResult = service.addResourceTrainingToCollectionIfMissing([], resourceTraining);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resourceTraining);
      });

      it('should not add a ResourceTraining to an array that contains it', () => {
        const resourceTraining: IResourceTraining = sampleWithRequiredData;
        const resourceTrainingCollection: IResourceTraining[] = [
          {
            ...resourceTraining,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResourceTrainingToCollectionIfMissing(resourceTrainingCollection, resourceTraining);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ResourceTraining to an array that doesn't contain it", () => {
        const resourceTraining: IResourceTraining = sampleWithRequiredData;
        const resourceTrainingCollection: IResourceTraining[] = [sampleWithPartialData];
        expectedResult = service.addResourceTrainingToCollectionIfMissing(resourceTrainingCollection, resourceTraining);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resourceTraining);
      });

      it('should add only unique ResourceTraining to an array', () => {
        const resourceTrainingArray: IResourceTraining[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const resourceTrainingCollection: IResourceTraining[] = [sampleWithRequiredData];
        expectedResult = service.addResourceTrainingToCollectionIfMissing(resourceTrainingCollection, ...resourceTrainingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resourceTraining: IResourceTraining = sampleWithRequiredData;
        const resourceTraining2: IResourceTraining = sampleWithPartialData;
        expectedResult = service.addResourceTrainingToCollectionIfMissing([], resourceTraining, resourceTraining2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resourceTraining);
        expect(expectedResult).toContain(resourceTraining2);
      });

      it('should accept null and undefined values', () => {
        const resourceTraining: IResourceTraining = sampleWithRequiredData;
        expectedResult = service.addResourceTrainingToCollectionIfMissing([], null, resourceTraining, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resourceTraining);
      });

      it('should return initial array if no ResourceTraining is added', () => {
        const resourceTrainingCollection: IResourceTraining[] = [sampleWithRequiredData];
        expectedResult = service.addResourceTrainingToCollectionIfMissing(resourceTrainingCollection, undefined, null);
        expect(expectedResult).toEqual(resourceTrainingCollection);
      });
    });

    describe('compareResourceTraining', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResourceTraining(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareResourceTraining(entity1, entity2);
        const compareResult2 = service.compareResourceTraining(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareResourceTraining(entity1, entity2);
        const compareResult2 = service.compareResourceTraining(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareResourceTraining(entity1, entity2);
        const compareResult2 = service.compareResourceTraining(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

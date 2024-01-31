import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRefRotation } from '../ref-rotation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ref-rotation.test-samples';

import { RefRotationService } from './ref-rotation.service';

const requireRestSample: IRefRotation = {
  ...sampleWithRequiredData,
};

describe('RefRotation Service', () => {
  let service: RefRotationService;
  let httpMock: HttpTestingController;
  let expectedResult: IRefRotation | IRefRotation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RefRotationService);
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

    it('should create a RefRotation', () => {
      const refRotation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(refRotation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RefRotation', () => {
      const refRotation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(refRotation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RefRotation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RefRotation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RefRotation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRefRotationToCollectionIfMissing', () => {
      it('should add a RefRotation to an empty array', () => {
        const refRotation: IRefRotation = sampleWithRequiredData;
        expectedResult = service.addRefRotationToCollectionIfMissing([], refRotation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(refRotation);
      });

      it('should not add a RefRotation to an array that contains it', () => {
        const refRotation: IRefRotation = sampleWithRequiredData;
        const refRotationCollection: IRefRotation[] = [
          {
            ...refRotation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRefRotationToCollectionIfMissing(refRotationCollection, refRotation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RefRotation to an array that doesn't contain it", () => {
        const refRotation: IRefRotation = sampleWithRequiredData;
        const refRotationCollection: IRefRotation[] = [sampleWithPartialData];
        expectedResult = service.addRefRotationToCollectionIfMissing(refRotationCollection, refRotation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(refRotation);
      });

      it('should add only unique RefRotation to an array', () => {
        const refRotationArray: IRefRotation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const refRotationCollection: IRefRotation[] = [sampleWithRequiredData];
        expectedResult = service.addRefRotationToCollectionIfMissing(refRotationCollection, ...refRotationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const refRotation: IRefRotation = sampleWithRequiredData;
        const refRotation2: IRefRotation = sampleWithPartialData;
        expectedResult = service.addRefRotationToCollectionIfMissing([], refRotation, refRotation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(refRotation);
        expect(expectedResult).toContain(refRotation2);
      });

      it('should accept null and undefined values', () => {
        const refRotation: IRefRotation = sampleWithRequiredData;
        expectedResult = service.addRefRotationToCollectionIfMissing([], null, refRotation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(refRotation);
      });

      it('should return initial array if no RefRotation is added', () => {
        const refRotationCollection: IRefRotation[] = [sampleWithRequiredData];
        expectedResult = service.addRefRotationToCollectionIfMissing(refRotationCollection, undefined, null);
        expect(expectedResult).toEqual(refRotationCollection);
      });
    });

    describe('compareRefRotation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRefRotation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRefRotation(entity1, entity2);
        const compareResult2 = service.compareRefRotation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRefRotation(entity1, entity2);
        const compareResult2 = service.compareRefRotation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRefRotation(entity1, entity2);
        const compareResult2 = service.compareRefRotation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

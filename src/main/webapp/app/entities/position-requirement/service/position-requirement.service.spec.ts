import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPositionRequirement } from '../position-requirement.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../position-requirement.test-samples';

import { PositionRequirementService } from './position-requirement.service';

const requireRestSample: IPositionRequirement = {
  ...sampleWithRequiredData,
};

describe('PositionRequirement Service', () => {
  let service: PositionRequirementService;
  let httpMock: HttpTestingController;
  let expectedResult: IPositionRequirement | IPositionRequirement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PositionRequirementService);
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

    it('should create a PositionRequirement', () => {
      const positionRequirement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(positionRequirement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PositionRequirement', () => {
      const positionRequirement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(positionRequirement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PositionRequirement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PositionRequirement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PositionRequirement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPositionRequirementToCollectionIfMissing', () => {
      it('should add a PositionRequirement to an empty array', () => {
        const positionRequirement: IPositionRequirement = sampleWithRequiredData;
        expectedResult = service.addPositionRequirementToCollectionIfMissing([], positionRequirement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(positionRequirement);
      });

      it('should not add a PositionRequirement to an array that contains it', () => {
        const positionRequirement: IPositionRequirement = sampleWithRequiredData;
        const positionRequirementCollection: IPositionRequirement[] = [
          {
            ...positionRequirement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPositionRequirementToCollectionIfMissing(positionRequirementCollection, positionRequirement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PositionRequirement to an array that doesn't contain it", () => {
        const positionRequirement: IPositionRequirement = sampleWithRequiredData;
        const positionRequirementCollection: IPositionRequirement[] = [sampleWithPartialData];
        expectedResult = service.addPositionRequirementToCollectionIfMissing(positionRequirementCollection, positionRequirement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(positionRequirement);
      });

      it('should add only unique PositionRequirement to an array', () => {
        const positionRequirementArray: IPositionRequirement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const positionRequirementCollection: IPositionRequirement[] = [sampleWithRequiredData];
        expectedResult = service.addPositionRequirementToCollectionIfMissing(positionRequirementCollection, ...positionRequirementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const positionRequirement: IPositionRequirement = sampleWithRequiredData;
        const positionRequirement2: IPositionRequirement = sampleWithPartialData;
        expectedResult = service.addPositionRequirementToCollectionIfMissing([], positionRequirement, positionRequirement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(positionRequirement);
        expect(expectedResult).toContain(positionRequirement2);
      });

      it('should accept null and undefined values', () => {
        const positionRequirement: IPositionRequirement = sampleWithRequiredData;
        expectedResult = service.addPositionRequirementToCollectionIfMissing([], null, positionRequirement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(positionRequirement);
      });

      it('should return initial array if no PositionRequirement is added', () => {
        const positionRequirementCollection: IPositionRequirement[] = [sampleWithRequiredData];
        expectedResult = service.addPositionRequirementToCollectionIfMissing(positionRequirementCollection, undefined, null);
        expect(expectedResult).toEqual(positionRequirementCollection);
      });
    });

    describe('comparePositionRequirement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePositionRequirement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePositionRequirement(entity1, entity2);
        const compareResult2 = service.comparePositionRequirement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePositionRequirement(entity1, entity2);
        const compareResult2 = service.comparePositionRequirement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePositionRequirement(entity1, entity2);
        const compareResult2 = service.comparePositionRequirement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

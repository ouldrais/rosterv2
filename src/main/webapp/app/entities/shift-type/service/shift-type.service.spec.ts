import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShiftType } from '../shift-type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shift-type.test-samples';

import { ShiftTypeService, RestShiftType } from './shift-type.service';

const requireRestSample: RestShiftType = {
  ...sampleWithRequiredData,
  start: sampleWithRequiredData.start?.toJSON(),
  end: sampleWithRequiredData.end?.toJSON(),
};

describe('ShiftType Service', () => {
  let service: ShiftTypeService;
  let httpMock: HttpTestingController;
  let expectedResult: IShiftType | IShiftType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShiftTypeService);
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

    it('should create a ShiftType', () => {
      const shiftType = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shiftType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShiftType', () => {
      const shiftType = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shiftType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ShiftType', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ShiftType', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ShiftType', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShiftTypeToCollectionIfMissing', () => {
      it('should add a ShiftType to an empty array', () => {
        const shiftType: IShiftType = sampleWithRequiredData;
        expectedResult = service.addShiftTypeToCollectionIfMissing([], shiftType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shiftType);
      });

      it('should not add a ShiftType to an array that contains it', () => {
        const shiftType: IShiftType = sampleWithRequiredData;
        const shiftTypeCollection: IShiftType[] = [
          {
            ...shiftType,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShiftTypeToCollectionIfMissing(shiftTypeCollection, shiftType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShiftType to an array that doesn't contain it", () => {
        const shiftType: IShiftType = sampleWithRequiredData;
        const shiftTypeCollection: IShiftType[] = [sampleWithPartialData];
        expectedResult = service.addShiftTypeToCollectionIfMissing(shiftTypeCollection, shiftType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shiftType);
      });

      it('should add only unique ShiftType to an array', () => {
        const shiftTypeArray: IShiftType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shiftTypeCollection: IShiftType[] = [sampleWithRequiredData];
        expectedResult = service.addShiftTypeToCollectionIfMissing(shiftTypeCollection, ...shiftTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shiftType: IShiftType = sampleWithRequiredData;
        const shiftType2: IShiftType = sampleWithPartialData;
        expectedResult = service.addShiftTypeToCollectionIfMissing([], shiftType, shiftType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shiftType);
        expect(expectedResult).toContain(shiftType2);
      });

      it('should accept null and undefined values', () => {
        const shiftType: IShiftType = sampleWithRequiredData;
        expectedResult = service.addShiftTypeToCollectionIfMissing([], null, shiftType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shiftType);
      });

      it('should return initial array if no ShiftType is added', () => {
        const shiftTypeCollection: IShiftType[] = [sampleWithRequiredData];
        expectedResult = service.addShiftTypeToCollectionIfMissing(shiftTypeCollection, undefined, null);
        expect(expectedResult).toEqual(shiftTypeCollection);
      });
    });

    describe('compareShiftType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShiftType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShiftType(entity1, entity2);
        const compareResult2 = service.compareShiftType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShiftType(entity1, entity2);
        const compareResult2 = service.compareShiftType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShiftType(entity1, entity2);
        const compareResult2 = service.compareShiftType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

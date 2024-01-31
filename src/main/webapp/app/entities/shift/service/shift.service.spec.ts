import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShift } from '../shift.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shift.test-samples';

import { ShiftService, RestShift } from './shift.service';

const requireRestSample: RestShift = {
  ...sampleWithRequiredData,
  shiftStart: sampleWithRequiredData.shiftStart?.toJSON(),
  shiftEnd: sampleWithRequiredData.shiftEnd?.toJSON(),
};

describe('Shift Service', () => {
  let service: ShiftService;
  let httpMock: HttpTestingController;
  let expectedResult: IShift | IShift[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShiftService);
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

    it('should create a Shift', () => {
      const shift = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shift).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Shift', () => {
      const shift = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shift).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Shift', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Shift', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Shift', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShiftToCollectionIfMissing', () => {
      it('should add a Shift to an empty array', () => {
        const shift: IShift = sampleWithRequiredData;
        expectedResult = service.addShiftToCollectionIfMissing([], shift);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shift);
      });

      it('should not add a Shift to an array that contains it', () => {
        const shift: IShift = sampleWithRequiredData;
        const shiftCollection: IShift[] = [
          {
            ...shift,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShiftToCollectionIfMissing(shiftCollection, shift);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Shift to an array that doesn't contain it", () => {
        const shift: IShift = sampleWithRequiredData;
        const shiftCollection: IShift[] = [sampleWithPartialData];
        expectedResult = service.addShiftToCollectionIfMissing(shiftCollection, shift);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shift);
      });

      it('should add only unique Shift to an array', () => {
        const shiftArray: IShift[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shiftCollection: IShift[] = [sampleWithRequiredData];
        expectedResult = service.addShiftToCollectionIfMissing(shiftCollection, ...shiftArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shift: IShift = sampleWithRequiredData;
        const shift2: IShift = sampleWithPartialData;
        expectedResult = service.addShiftToCollectionIfMissing([], shift, shift2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shift);
        expect(expectedResult).toContain(shift2);
      });

      it('should accept null and undefined values', () => {
        const shift: IShift = sampleWithRequiredData;
        expectedResult = service.addShiftToCollectionIfMissing([], null, shift, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shift);
      });

      it('should return initial array if no Shift is added', () => {
        const shiftCollection: IShift[] = [sampleWithRequiredData];
        expectedResult = service.addShiftToCollectionIfMissing(shiftCollection, undefined, null);
        expect(expectedResult).toEqual(shiftCollection);
      });
    });

    describe('compareShift', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShift(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShift(entity1, entity2);
        const compareResult2 = service.compareShift(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShift(entity1, entity2);
        const compareResult2 = service.compareShift(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShift(entity1, entity2);
        const compareResult2 = service.compareShift(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

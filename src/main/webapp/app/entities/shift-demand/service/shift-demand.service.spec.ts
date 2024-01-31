import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShiftDemand } from '../shift-demand.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shift-demand.test-samples';

import { ShiftDemandService } from './shift-demand.service';

const requireRestSample: IShiftDemand = {
  ...sampleWithRequiredData,
};

describe('ShiftDemand Service', () => {
  let service: ShiftDemandService;
  let httpMock: HttpTestingController;
  let expectedResult: IShiftDemand | IShiftDemand[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShiftDemandService);
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

    it('should create a ShiftDemand', () => {
      const shiftDemand = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shiftDemand).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShiftDemand', () => {
      const shiftDemand = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shiftDemand).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ShiftDemand', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ShiftDemand', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ShiftDemand', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShiftDemandToCollectionIfMissing', () => {
      it('should add a ShiftDemand to an empty array', () => {
        const shiftDemand: IShiftDemand = sampleWithRequiredData;
        expectedResult = service.addShiftDemandToCollectionIfMissing([], shiftDemand);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shiftDemand);
      });

      it('should not add a ShiftDemand to an array that contains it', () => {
        const shiftDemand: IShiftDemand = sampleWithRequiredData;
        const shiftDemandCollection: IShiftDemand[] = [
          {
            ...shiftDemand,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShiftDemandToCollectionIfMissing(shiftDemandCollection, shiftDemand);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShiftDemand to an array that doesn't contain it", () => {
        const shiftDemand: IShiftDemand = sampleWithRequiredData;
        const shiftDemandCollection: IShiftDemand[] = [sampleWithPartialData];
        expectedResult = service.addShiftDemandToCollectionIfMissing(shiftDemandCollection, shiftDemand);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shiftDemand);
      });

      it('should add only unique ShiftDemand to an array', () => {
        const shiftDemandArray: IShiftDemand[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shiftDemandCollection: IShiftDemand[] = [sampleWithRequiredData];
        expectedResult = service.addShiftDemandToCollectionIfMissing(shiftDemandCollection, ...shiftDemandArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shiftDemand: IShiftDemand = sampleWithRequiredData;
        const shiftDemand2: IShiftDemand = sampleWithPartialData;
        expectedResult = service.addShiftDemandToCollectionIfMissing([], shiftDemand, shiftDemand2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shiftDemand);
        expect(expectedResult).toContain(shiftDemand2);
      });

      it('should accept null and undefined values', () => {
        const shiftDemand: IShiftDemand = sampleWithRequiredData;
        expectedResult = service.addShiftDemandToCollectionIfMissing([], null, shiftDemand, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shiftDemand);
      });

      it('should return initial array if no ShiftDemand is added', () => {
        const shiftDemandCollection: IShiftDemand[] = [sampleWithRequiredData];
        expectedResult = service.addShiftDemandToCollectionIfMissing(shiftDemandCollection, undefined, null);
        expect(expectedResult).toEqual(shiftDemandCollection);
      });
    });

    describe('compareShiftDemand', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShiftDemand(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShiftDemand(entity1, entity2);
        const compareResult2 = service.compareShiftDemand(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShiftDemand(entity1, entity2);
        const compareResult2 = service.compareShiftDemand(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShiftDemand(entity1, entity2);
        const compareResult2 = service.compareShiftDemand(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

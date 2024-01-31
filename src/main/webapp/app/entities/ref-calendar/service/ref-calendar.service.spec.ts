import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRefCalendar } from '../ref-calendar.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ref-calendar.test-samples';

import { RefCalendarService } from './ref-calendar.service';

const requireRestSample: IRefCalendar = {
  ...sampleWithRequiredData,
};

describe('RefCalendar Service', () => {
  let service: RefCalendarService;
  let httpMock: HttpTestingController;
  let expectedResult: IRefCalendar | IRefCalendar[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RefCalendarService);
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

    it('should create a RefCalendar', () => {
      const refCalendar = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(refCalendar).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RefCalendar', () => {
      const refCalendar = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(refCalendar).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RefCalendar', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RefCalendar', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RefCalendar', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRefCalendarToCollectionIfMissing', () => {
      it('should add a RefCalendar to an empty array', () => {
        const refCalendar: IRefCalendar = sampleWithRequiredData;
        expectedResult = service.addRefCalendarToCollectionIfMissing([], refCalendar);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(refCalendar);
      });

      it('should not add a RefCalendar to an array that contains it', () => {
        const refCalendar: IRefCalendar = sampleWithRequiredData;
        const refCalendarCollection: IRefCalendar[] = [
          {
            ...refCalendar,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRefCalendarToCollectionIfMissing(refCalendarCollection, refCalendar);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RefCalendar to an array that doesn't contain it", () => {
        const refCalendar: IRefCalendar = sampleWithRequiredData;
        const refCalendarCollection: IRefCalendar[] = [sampleWithPartialData];
        expectedResult = service.addRefCalendarToCollectionIfMissing(refCalendarCollection, refCalendar);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(refCalendar);
      });

      it('should add only unique RefCalendar to an array', () => {
        const refCalendarArray: IRefCalendar[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const refCalendarCollection: IRefCalendar[] = [sampleWithRequiredData];
        expectedResult = service.addRefCalendarToCollectionIfMissing(refCalendarCollection, ...refCalendarArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const refCalendar: IRefCalendar = sampleWithRequiredData;
        const refCalendar2: IRefCalendar = sampleWithPartialData;
        expectedResult = service.addRefCalendarToCollectionIfMissing([], refCalendar, refCalendar2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(refCalendar);
        expect(expectedResult).toContain(refCalendar2);
      });

      it('should accept null and undefined values', () => {
        const refCalendar: IRefCalendar = sampleWithRequiredData;
        expectedResult = service.addRefCalendarToCollectionIfMissing([], null, refCalendar, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(refCalendar);
      });

      it('should return initial array if no RefCalendar is added', () => {
        const refCalendarCollection: IRefCalendar[] = [sampleWithRequiredData];
        expectedResult = service.addRefCalendarToCollectionIfMissing(refCalendarCollection, undefined, null);
        expect(expectedResult).toEqual(refCalendarCollection);
      });
    });

    describe('compareRefCalendar', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRefCalendar(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRefCalendar(entity1, entity2);
        const compareResult2 = service.compareRefCalendar(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRefCalendar(entity1, entity2);
        const compareResult2 = service.compareRefCalendar(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRefCalendar(entity1, entity2);
        const compareResult2 = service.compareRefCalendar(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

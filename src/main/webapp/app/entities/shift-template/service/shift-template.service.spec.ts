import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShiftTemplate } from '../shift-template.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shift-template.test-samples';

import { ShiftTemplateService, RestShiftTemplate } from './shift-template.service';

const requireRestSample: RestShiftTemplate = {
  ...sampleWithRequiredData,
  shiftStart: sampleWithRequiredData.shiftStart?.toJSON(),
  shiftEnd: sampleWithRequiredData.shiftEnd?.toJSON(),
};

describe('ShiftTemplate Service', () => {
  let service: ShiftTemplateService;
  let httpMock: HttpTestingController;
  let expectedResult: IShiftTemplate | IShiftTemplate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShiftTemplateService);
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

    it('should create a ShiftTemplate', () => {
      const shiftTemplate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shiftTemplate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShiftTemplate', () => {
      const shiftTemplate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shiftTemplate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ShiftTemplate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ShiftTemplate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ShiftTemplate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShiftTemplateToCollectionIfMissing', () => {
      it('should add a ShiftTemplate to an empty array', () => {
        const shiftTemplate: IShiftTemplate = sampleWithRequiredData;
        expectedResult = service.addShiftTemplateToCollectionIfMissing([], shiftTemplate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shiftTemplate);
      });

      it('should not add a ShiftTemplate to an array that contains it', () => {
        const shiftTemplate: IShiftTemplate = sampleWithRequiredData;
        const shiftTemplateCollection: IShiftTemplate[] = [
          {
            ...shiftTemplate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShiftTemplateToCollectionIfMissing(shiftTemplateCollection, shiftTemplate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShiftTemplate to an array that doesn't contain it", () => {
        const shiftTemplate: IShiftTemplate = sampleWithRequiredData;
        const shiftTemplateCollection: IShiftTemplate[] = [sampleWithPartialData];
        expectedResult = service.addShiftTemplateToCollectionIfMissing(shiftTemplateCollection, shiftTemplate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shiftTemplate);
      });

      it('should add only unique ShiftTemplate to an array', () => {
        const shiftTemplateArray: IShiftTemplate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shiftTemplateCollection: IShiftTemplate[] = [sampleWithRequiredData];
        expectedResult = service.addShiftTemplateToCollectionIfMissing(shiftTemplateCollection, ...shiftTemplateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shiftTemplate: IShiftTemplate = sampleWithRequiredData;
        const shiftTemplate2: IShiftTemplate = sampleWithPartialData;
        expectedResult = service.addShiftTemplateToCollectionIfMissing([], shiftTemplate, shiftTemplate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shiftTemplate);
        expect(expectedResult).toContain(shiftTemplate2);
      });

      it('should accept null and undefined values', () => {
        const shiftTemplate: IShiftTemplate = sampleWithRequiredData;
        expectedResult = service.addShiftTemplateToCollectionIfMissing([], null, shiftTemplate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shiftTemplate);
      });

      it('should return initial array if no ShiftTemplate is added', () => {
        const shiftTemplateCollection: IShiftTemplate[] = [sampleWithRequiredData];
        expectedResult = service.addShiftTemplateToCollectionIfMissing(shiftTemplateCollection, undefined, null);
        expect(expectedResult).toEqual(shiftTemplateCollection);
      });
    });

    describe('compareShiftTemplate', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShiftTemplate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShiftTemplate(entity1, entity2);
        const compareResult2 = service.compareShiftTemplate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShiftTemplate(entity1, entity2);
        const compareResult2 = service.compareShiftTemplate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShiftTemplate(entity1, entity2);
        const compareResult2 = service.compareShiftTemplate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

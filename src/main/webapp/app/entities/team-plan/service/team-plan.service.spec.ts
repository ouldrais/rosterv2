import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITeamPlan } from '../team-plan.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../team-plan.test-samples';

import { TeamPlanService } from './team-plan.service';

const requireRestSample: ITeamPlan = {
  ...sampleWithRequiredData,
};

describe('TeamPlan Service', () => {
  let service: TeamPlanService;
  let httpMock: HttpTestingController;
  let expectedResult: ITeamPlan | ITeamPlan[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TeamPlanService);
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

    it('should create a TeamPlan', () => {
      const teamPlan = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(teamPlan).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TeamPlan', () => {
      const teamPlan = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(teamPlan).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TeamPlan', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TeamPlan', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TeamPlan', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTeamPlanToCollectionIfMissing', () => {
      it('should add a TeamPlan to an empty array', () => {
        const teamPlan: ITeamPlan = sampleWithRequiredData;
        expectedResult = service.addTeamPlanToCollectionIfMissing([], teamPlan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(teamPlan);
      });

      it('should not add a TeamPlan to an array that contains it', () => {
        const teamPlan: ITeamPlan = sampleWithRequiredData;
        const teamPlanCollection: ITeamPlan[] = [
          {
            ...teamPlan,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTeamPlanToCollectionIfMissing(teamPlanCollection, teamPlan);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TeamPlan to an array that doesn't contain it", () => {
        const teamPlan: ITeamPlan = sampleWithRequiredData;
        const teamPlanCollection: ITeamPlan[] = [sampleWithPartialData];
        expectedResult = service.addTeamPlanToCollectionIfMissing(teamPlanCollection, teamPlan);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(teamPlan);
      });

      it('should add only unique TeamPlan to an array', () => {
        const teamPlanArray: ITeamPlan[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const teamPlanCollection: ITeamPlan[] = [sampleWithRequiredData];
        expectedResult = service.addTeamPlanToCollectionIfMissing(teamPlanCollection, ...teamPlanArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const teamPlan: ITeamPlan = sampleWithRequiredData;
        const teamPlan2: ITeamPlan = sampleWithPartialData;
        expectedResult = service.addTeamPlanToCollectionIfMissing([], teamPlan, teamPlan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(teamPlan);
        expect(expectedResult).toContain(teamPlan2);
      });

      it('should accept null and undefined values', () => {
        const teamPlan: ITeamPlan = sampleWithRequiredData;
        expectedResult = service.addTeamPlanToCollectionIfMissing([], null, teamPlan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(teamPlan);
      });

      it('should return initial array if no TeamPlan is added', () => {
        const teamPlanCollection: ITeamPlan[] = [sampleWithRequiredData];
        expectedResult = service.addTeamPlanToCollectionIfMissing(teamPlanCollection, undefined, null);
        expect(expectedResult).toEqual(teamPlanCollection);
      });
    });

    describe('compareTeamPlan', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTeamPlan(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTeamPlan(entity1, entity2);
        const compareResult2 = service.compareTeamPlan(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTeamPlan(entity1, entity2);
        const compareResult2 = service.compareTeamPlan(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTeamPlan(entity1, entity2);
        const compareResult2 = service.compareTeamPlan(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

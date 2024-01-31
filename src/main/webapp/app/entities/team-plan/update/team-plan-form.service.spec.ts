import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../team-plan.test-samples';

import { TeamPlanFormService } from './team-plan-form.service';

describe('TeamPlan Form Service', () => {
  let service: TeamPlanFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamPlanFormService);
  });

  describe('Service methods', () => {
    describe('createTeamPlanFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTeamPlanFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            team: expect.any(Object),
            shift: expect.any(Object),
          }),
        );
      });

      it('passing ITeamPlan should create a new form with FormGroup', () => {
        const formGroup = service.createTeamPlanFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            team: expect.any(Object),
            shift: expect.any(Object),
          }),
        );
      });
    });

    describe('getTeamPlan', () => {
      it('should return NewTeamPlan for default TeamPlan initial value', () => {
        const formGroup = service.createTeamPlanFormGroup(sampleWithNewData);

        const teamPlan = service.getTeamPlan(formGroup) as any;

        expect(teamPlan).toMatchObject(sampleWithNewData);
      });

      it('should return NewTeamPlan for empty TeamPlan initial value', () => {
        const formGroup = service.createTeamPlanFormGroup();

        const teamPlan = service.getTeamPlan(formGroup) as any;

        expect(teamPlan).toMatchObject({});
      });

      it('should return ITeamPlan', () => {
        const formGroup = service.createTeamPlanFormGroup(sampleWithRequiredData);

        const teamPlan = service.getTeamPlan(formGroup) as any;

        expect(teamPlan).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITeamPlan should not enable id FormControl', () => {
        const formGroup = service.createTeamPlanFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTeamPlan should disable id FormControl', () => {
        const formGroup = service.createTeamPlanFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

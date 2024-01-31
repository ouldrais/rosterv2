import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IShift } from 'app/entities/shift/shift.model';
import { ShiftService } from 'app/entities/shift/service/shift.service';
import { ITeamPlan } from '../team-plan.model';
import { TeamPlanService } from '../service/team-plan.service';
import { TeamPlanFormService } from './team-plan-form.service';

import { TeamPlanUpdateComponent } from './team-plan-update.component';

describe('TeamPlan Management Update Component', () => {
  let comp: TeamPlanUpdateComponent;
  let fixture: ComponentFixture<TeamPlanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let teamPlanFormService: TeamPlanFormService;
  let teamPlanService: TeamPlanService;
  let teamService: TeamService;
  let shiftService: ShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TeamPlanUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TeamPlanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TeamPlanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    teamPlanFormService = TestBed.inject(TeamPlanFormService);
    teamPlanService = TestBed.inject(TeamPlanService);
    teamService = TestBed.inject(TeamService);
    shiftService = TestBed.inject(ShiftService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Team query and add missing value', () => {
      const teamPlan: ITeamPlan = { id: 456 };
      const team: ITeam = { id: 29527 };
      teamPlan.team = team;

      const teamCollection: ITeam[] = [{ id: 19774 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [team];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ teamPlan });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining),
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shift query and add missing value', () => {
      const teamPlan: ITeamPlan = { id: 456 };
      const shift: IShift = { id: 504 };
      teamPlan.shift = shift;

      const shiftCollection: IShift[] = [{ id: 28547 }];
      jest.spyOn(shiftService, 'query').mockReturnValue(of(new HttpResponse({ body: shiftCollection })));
      const additionalShifts = [shift];
      const expectedCollection: IShift[] = [...additionalShifts, ...shiftCollection];
      jest.spyOn(shiftService, 'addShiftToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ teamPlan });
      comp.ngOnInit();

      expect(shiftService.query).toHaveBeenCalled();
      expect(shiftService.addShiftToCollectionIfMissing).toHaveBeenCalledWith(
        shiftCollection,
        ...additionalShifts.map(expect.objectContaining),
      );
      expect(comp.shiftsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const teamPlan: ITeamPlan = { id: 456 };
      const team: ITeam = { id: 2720 };
      teamPlan.team = team;
      const shift: IShift = { id: 15161 };
      teamPlan.shift = shift;

      activatedRoute.data = of({ teamPlan });
      comp.ngOnInit();

      expect(comp.teamsSharedCollection).toContain(team);
      expect(comp.shiftsSharedCollection).toContain(shift);
      expect(comp.teamPlan).toEqual(teamPlan);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITeamPlan>>();
      const teamPlan = { id: 123 };
      jest.spyOn(teamPlanFormService, 'getTeamPlan').mockReturnValue(teamPlan);
      jest.spyOn(teamPlanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ teamPlan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: teamPlan }));
      saveSubject.complete();

      // THEN
      expect(teamPlanFormService.getTeamPlan).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(teamPlanService.update).toHaveBeenCalledWith(expect.objectContaining(teamPlan));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITeamPlan>>();
      const teamPlan = { id: 123 };
      jest.spyOn(teamPlanFormService, 'getTeamPlan').mockReturnValue({ id: null });
      jest.spyOn(teamPlanService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ teamPlan: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: teamPlan }));
      saveSubject.complete();

      // THEN
      expect(teamPlanFormService.getTeamPlan).toHaveBeenCalled();
      expect(teamPlanService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITeamPlan>>();
      const teamPlan = { id: 123 };
      jest.spyOn(teamPlanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ teamPlan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(teamPlanService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTeam', () => {
      it('Should forward to teamService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(teamService, 'compareTeam');
        comp.compareTeam(entity, entity2);
        expect(teamService.compareTeam).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareShift', () => {
      it('Should forward to shiftService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(shiftService, 'compareShift');
        comp.compareShift(entity, entity2);
        expect(shiftService.compareShift).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

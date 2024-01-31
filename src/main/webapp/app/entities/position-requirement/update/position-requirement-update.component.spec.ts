import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ITraining } from 'app/entities/training/training.model';
import { TrainingService } from 'app/entities/training/service/training.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { IPositionRequirement } from '../position-requirement.model';
import { PositionRequirementService } from '../service/position-requirement.service';
import { PositionRequirementFormService } from './position-requirement-form.service';

import { PositionRequirementUpdateComponent } from './position-requirement-update.component';

describe('PositionRequirement Management Update Component', () => {
  let comp: PositionRequirementUpdateComponent;
  let fixture: ComponentFixture<PositionRequirementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let positionRequirementFormService: PositionRequirementFormService;
  let positionRequirementService: PositionRequirementService;
  let trainingService: TrainingService;
  let positionService: PositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PositionRequirementUpdateComponent],
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
      .overrideTemplate(PositionRequirementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PositionRequirementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    positionRequirementFormService = TestBed.inject(PositionRequirementFormService);
    positionRequirementService = TestBed.inject(PositionRequirementService);
    trainingService = TestBed.inject(TrainingService);
    positionService = TestBed.inject(PositionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Training query and add missing value', () => {
      const positionRequirement: IPositionRequirement = { id: 456 };
      const training: ITraining = { id: 31302 };
      positionRequirement.training = training;

      const trainingCollection: ITraining[] = [{ id: 31521 }];
      jest.spyOn(trainingService, 'query').mockReturnValue(of(new HttpResponse({ body: trainingCollection })));
      const additionalTrainings = [training];
      const expectedCollection: ITraining[] = [...additionalTrainings, ...trainingCollection];
      jest.spyOn(trainingService, 'addTrainingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ positionRequirement });
      comp.ngOnInit();

      expect(trainingService.query).toHaveBeenCalled();
      expect(trainingService.addTrainingToCollectionIfMissing).toHaveBeenCalledWith(
        trainingCollection,
        ...additionalTrainings.map(expect.objectContaining),
      );
      expect(comp.trainingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Position query and add missing value', () => {
      const positionRequirement: IPositionRequirement = { id: 456 };
      const position: IPosition = { id: 4374 };
      positionRequirement.position = position;

      const positionCollection: IPosition[] = [{ id: 1067 }];
      jest.spyOn(positionService, 'query').mockReturnValue(of(new HttpResponse({ body: positionCollection })));
      const additionalPositions = [position];
      const expectedCollection: IPosition[] = [...additionalPositions, ...positionCollection];
      jest.spyOn(positionService, 'addPositionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ positionRequirement });
      comp.ngOnInit();

      expect(positionService.query).toHaveBeenCalled();
      expect(positionService.addPositionToCollectionIfMissing).toHaveBeenCalledWith(
        positionCollection,
        ...additionalPositions.map(expect.objectContaining),
      );
      expect(comp.positionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const positionRequirement: IPositionRequirement = { id: 456 };
      const training: ITraining = { id: 2694 };
      positionRequirement.training = training;
      const position: IPosition = { id: 6444 };
      positionRequirement.position = position;

      activatedRoute.data = of({ positionRequirement });
      comp.ngOnInit();

      expect(comp.trainingsSharedCollection).toContain(training);
      expect(comp.positionsSharedCollection).toContain(position);
      expect(comp.positionRequirement).toEqual(positionRequirement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPositionRequirement>>();
      const positionRequirement = { id: 123 };
      jest.spyOn(positionRequirementFormService, 'getPositionRequirement').mockReturnValue(positionRequirement);
      jest.spyOn(positionRequirementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positionRequirement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: positionRequirement }));
      saveSubject.complete();

      // THEN
      expect(positionRequirementFormService.getPositionRequirement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(positionRequirementService.update).toHaveBeenCalledWith(expect.objectContaining(positionRequirement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPositionRequirement>>();
      const positionRequirement = { id: 123 };
      jest.spyOn(positionRequirementFormService, 'getPositionRequirement').mockReturnValue({ id: null });
      jest.spyOn(positionRequirementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positionRequirement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: positionRequirement }));
      saveSubject.complete();

      // THEN
      expect(positionRequirementFormService.getPositionRequirement).toHaveBeenCalled();
      expect(positionRequirementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPositionRequirement>>();
      const positionRequirement = { id: 123 };
      jest.spyOn(positionRequirementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positionRequirement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(positionRequirementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTraining', () => {
      it('Should forward to trainingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(trainingService, 'compareTraining');
        comp.compareTraining(entity, entity2);
        expect(trainingService.compareTraining).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePosition', () => {
      it('Should forward to positionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(positionService, 'comparePosition');
        comp.comparePosition(entity, entity2);
        expect(positionService.comparePosition).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IResource } from 'app/entities/resource/resource.model';
import { ResourceService } from 'app/entities/resource/service/resource.service';
import { IShift } from 'app/entities/shift/shift.model';
import { ShiftService } from 'app/entities/shift/service/shift.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { IResourcePlan } from '../resource-plan.model';
import { ResourcePlanService } from '../service/resource-plan.service';
import { ResourcePlanFormService } from './resource-plan-form.service';

import { ResourcePlanUpdateComponent } from './resource-plan-update.component';

describe('ResourcePlan Management Update Component', () => {
  let comp: ResourcePlanUpdateComponent;
  let fixture: ComponentFixture<ResourcePlanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let resourcePlanFormService: ResourcePlanFormService;
  let resourcePlanService: ResourcePlanService;
  let resourceService: ResourceService;
  let shiftService: ShiftService;
  let positionService: PositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ResourcePlanUpdateComponent],
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
      .overrideTemplate(ResourcePlanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourcePlanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resourcePlanFormService = TestBed.inject(ResourcePlanFormService);
    resourcePlanService = TestBed.inject(ResourcePlanService);
    resourceService = TestBed.inject(ResourceService);
    shiftService = TestBed.inject(ShiftService);
    positionService = TestBed.inject(PositionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Resource query and add missing value', () => {
      const resourcePlan: IResourcePlan = { id: 456 };
      const resource: IResource = { id: 31417 };
      resourcePlan.resource = resource;

      const resourceCollection: IResource[] = [{ id: 15651 }];
      jest.spyOn(resourceService, 'query').mockReturnValue(of(new HttpResponse({ body: resourceCollection })));
      const additionalResources = [resource];
      const expectedCollection: IResource[] = [...additionalResources, ...resourceCollection];
      jest.spyOn(resourceService, 'addResourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourcePlan });
      comp.ngOnInit();

      expect(resourceService.query).toHaveBeenCalled();
      expect(resourceService.addResourceToCollectionIfMissing).toHaveBeenCalledWith(
        resourceCollection,
        ...additionalResources.map(expect.objectContaining),
      );
      expect(comp.resourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shift query and add missing value', () => {
      const resourcePlan: IResourcePlan = { id: 456 };
      const shift: IShift = { id: 5634 };
      resourcePlan.shift = shift;

      const shiftCollection: IShift[] = [{ id: 29666 }];
      jest.spyOn(shiftService, 'query').mockReturnValue(of(new HttpResponse({ body: shiftCollection })));
      const additionalShifts = [shift];
      const expectedCollection: IShift[] = [...additionalShifts, ...shiftCollection];
      jest.spyOn(shiftService, 'addShiftToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourcePlan });
      comp.ngOnInit();

      expect(shiftService.query).toHaveBeenCalled();
      expect(shiftService.addShiftToCollectionIfMissing).toHaveBeenCalledWith(
        shiftCollection,
        ...additionalShifts.map(expect.objectContaining),
      );
      expect(comp.shiftsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Position query and add missing value', () => {
      const resourcePlan: IResourcePlan = { id: 456 };
      const position: IPosition = { id: 16757 };
      resourcePlan.position = position;

      const positionCollection: IPosition[] = [{ id: 6192 }];
      jest.spyOn(positionService, 'query').mockReturnValue(of(new HttpResponse({ body: positionCollection })));
      const additionalPositions = [position];
      const expectedCollection: IPosition[] = [...additionalPositions, ...positionCollection];
      jest.spyOn(positionService, 'addPositionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourcePlan });
      comp.ngOnInit();

      expect(positionService.query).toHaveBeenCalled();
      expect(positionService.addPositionToCollectionIfMissing).toHaveBeenCalledWith(
        positionCollection,
        ...additionalPositions.map(expect.objectContaining),
      );
      expect(comp.positionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const resourcePlan: IResourcePlan = { id: 456 };
      const resource: IResource = { id: 988 };
      resourcePlan.resource = resource;
      const shift: IShift = { id: 18617 };
      resourcePlan.shift = shift;
      const position: IPosition = { id: 28078 };
      resourcePlan.position = position;

      activatedRoute.data = of({ resourcePlan });
      comp.ngOnInit();

      expect(comp.resourcesSharedCollection).toContain(resource);
      expect(comp.shiftsSharedCollection).toContain(shift);
      expect(comp.positionsSharedCollection).toContain(position);
      expect(comp.resourcePlan).toEqual(resourcePlan);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourcePlan>>();
      const resourcePlan = { id: 123 };
      jest.spyOn(resourcePlanFormService, 'getResourcePlan').mockReturnValue(resourcePlan);
      jest.spyOn(resourcePlanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourcePlan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resourcePlan }));
      saveSubject.complete();

      // THEN
      expect(resourcePlanFormService.getResourcePlan).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(resourcePlanService.update).toHaveBeenCalledWith(expect.objectContaining(resourcePlan));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourcePlan>>();
      const resourcePlan = { id: 123 };
      jest.spyOn(resourcePlanFormService, 'getResourcePlan').mockReturnValue({ id: null });
      jest.spyOn(resourcePlanService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourcePlan: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resourcePlan }));
      saveSubject.complete();

      // THEN
      expect(resourcePlanFormService.getResourcePlan).toHaveBeenCalled();
      expect(resourcePlanService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourcePlan>>();
      const resourcePlan = { id: 123 };
      jest.spyOn(resourcePlanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourcePlan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resourcePlanService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareResource', () => {
      it('Should forward to resourceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(resourceService, 'compareResource');
        comp.compareResource(entity, entity2);
        expect(resourceService.compareResource).toHaveBeenCalledWith(entity, entity2);
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

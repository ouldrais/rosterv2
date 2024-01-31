import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IShiftType } from 'app/entities/shift-type/shift-type.model';
import { ShiftTypeService } from 'app/entities/shift-type/service/shift-type.service';
import { RefRotationService } from '../service/ref-rotation.service';
import { IRefRotation } from '../ref-rotation.model';
import { RefRotationFormService } from './ref-rotation-form.service';

import { RefRotationUpdateComponent } from './ref-rotation-update.component';

describe('RefRotation Management Update Component', () => {
  let comp: RefRotationUpdateComponent;
  let fixture: ComponentFixture<RefRotationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let refRotationFormService: RefRotationFormService;
  let refRotationService: RefRotationService;
  let shiftTypeService: ShiftTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), RefRotationUpdateComponent],
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
      .overrideTemplate(RefRotationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RefRotationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    refRotationFormService = TestBed.inject(RefRotationFormService);
    refRotationService = TestBed.inject(RefRotationService);
    shiftTypeService = TestBed.inject(ShiftTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ShiftType query and add missing value', () => {
      const refRotation: IRefRotation = { id: 456 };
      const shiftType: IShiftType = { id: 20271 };
      refRotation.shiftType = shiftType;

      const shiftTypeCollection: IShiftType[] = [{ id: 29916 }];
      jest.spyOn(shiftTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: shiftTypeCollection })));
      const additionalShiftTypes = [shiftType];
      const expectedCollection: IShiftType[] = [...additionalShiftTypes, ...shiftTypeCollection];
      jest.spyOn(shiftTypeService, 'addShiftTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ refRotation });
      comp.ngOnInit();

      expect(shiftTypeService.query).toHaveBeenCalled();
      expect(shiftTypeService.addShiftTypeToCollectionIfMissing).toHaveBeenCalledWith(
        shiftTypeCollection,
        ...additionalShiftTypes.map(expect.objectContaining),
      );
      expect(comp.shiftTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const refRotation: IRefRotation = { id: 456 };
      const shiftType: IShiftType = { id: 12120 };
      refRotation.shiftType = shiftType;

      activatedRoute.data = of({ refRotation });
      comp.ngOnInit();

      expect(comp.shiftTypesSharedCollection).toContain(shiftType);
      expect(comp.refRotation).toEqual(refRotation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRefRotation>>();
      const refRotation = { id: 123 };
      jest.spyOn(refRotationFormService, 'getRefRotation').mockReturnValue(refRotation);
      jest.spyOn(refRotationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refRotation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: refRotation }));
      saveSubject.complete();

      // THEN
      expect(refRotationFormService.getRefRotation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(refRotationService.update).toHaveBeenCalledWith(expect.objectContaining(refRotation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRefRotation>>();
      const refRotation = { id: 123 };
      jest.spyOn(refRotationFormService, 'getRefRotation').mockReturnValue({ id: null });
      jest.spyOn(refRotationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refRotation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: refRotation }));
      saveSubject.complete();

      // THEN
      expect(refRotationFormService.getRefRotation).toHaveBeenCalled();
      expect(refRotationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRefRotation>>();
      const refRotation = { id: 123 };
      jest.spyOn(refRotationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refRotation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(refRotationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareShiftType', () => {
      it('Should forward to shiftTypeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(shiftTypeService, 'compareShiftType');
        comp.compareShiftType(entity, entity2);
        expect(shiftTypeService.compareShiftType).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IShiftType } from 'app/entities/shift-type/shift-type.model';
import { ShiftTypeService } from 'app/entities/shift-type/service/shift-type.service';
import { RefCalendarService } from '../service/ref-calendar.service';
import { IRefCalendar } from '../ref-calendar.model';
import { RefCalendarFormService } from './ref-calendar-form.service';

import { RefCalendarUpdateComponent } from './ref-calendar-update.component';

describe('RefCalendar Management Update Component', () => {
  let comp: RefCalendarUpdateComponent;
  let fixture: ComponentFixture<RefCalendarUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let refCalendarFormService: RefCalendarFormService;
  let refCalendarService: RefCalendarService;
  let shiftTypeService: ShiftTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), RefCalendarUpdateComponent],
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
      .overrideTemplate(RefCalendarUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RefCalendarUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    refCalendarFormService = TestBed.inject(RefCalendarFormService);
    refCalendarService = TestBed.inject(RefCalendarService);
    shiftTypeService = TestBed.inject(ShiftTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ShiftType query and add missing value', () => {
      const refCalendar: IRefCalendar = { id: 456 };
      const shiftType: IShiftType = { id: 1012 };
      refCalendar.shiftType = shiftType;

      const shiftTypeCollection: IShiftType[] = [{ id: 20914 }];
      jest.spyOn(shiftTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: shiftTypeCollection })));
      const additionalShiftTypes = [shiftType];
      const expectedCollection: IShiftType[] = [...additionalShiftTypes, ...shiftTypeCollection];
      jest.spyOn(shiftTypeService, 'addShiftTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ refCalendar });
      comp.ngOnInit();

      expect(shiftTypeService.query).toHaveBeenCalled();
      expect(shiftTypeService.addShiftTypeToCollectionIfMissing).toHaveBeenCalledWith(
        shiftTypeCollection,
        ...additionalShiftTypes.map(expect.objectContaining),
      );
      expect(comp.shiftTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const refCalendar: IRefCalendar = { id: 456 };
      const shiftType: IShiftType = { id: 28891 };
      refCalendar.shiftType = shiftType;

      activatedRoute.data = of({ refCalendar });
      comp.ngOnInit();

      expect(comp.shiftTypesSharedCollection).toContain(shiftType);
      expect(comp.refCalendar).toEqual(refCalendar);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRefCalendar>>();
      const refCalendar = { id: 123 };
      jest.spyOn(refCalendarFormService, 'getRefCalendar').mockReturnValue(refCalendar);
      jest.spyOn(refCalendarService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refCalendar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: refCalendar }));
      saveSubject.complete();

      // THEN
      expect(refCalendarFormService.getRefCalendar).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(refCalendarService.update).toHaveBeenCalledWith(expect.objectContaining(refCalendar));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRefCalendar>>();
      const refCalendar = { id: 123 };
      jest.spyOn(refCalendarFormService, 'getRefCalendar').mockReturnValue({ id: null });
      jest.spyOn(refCalendarService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refCalendar: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: refCalendar }));
      saveSubject.complete();

      // THEN
      expect(refCalendarFormService.getRefCalendar).toHaveBeenCalled();
      expect(refCalendarService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRefCalendar>>();
      const refCalendar = { id: 123 };
      jest.spyOn(refCalendarService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ refCalendar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(refCalendarService.update).toHaveBeenCalled();
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

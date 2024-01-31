import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShiftTypeService } from '../service/shift-type.service';
import { IShiftType } from '../shift-type.model';
import { ShiftTypeFormService } from './shift-type-form.service';

import { ShiftTypeUpdateComponent } from './shift-type-update.component';

describe('ShiftType Management Update Component', () => {
  let comp: ShiftTypeUpdateComponent;
  let fixture: ComponentFixture<ShiftTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shiftTypeFormService: ShiftTypeFormService;
  let shiftTypeService: ShiftTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ShiftTypeUpdateComponent],
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
      .overrideTemplate(ShiftTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shiftTypeFormService = TestBed.inject(ShiftTypeFormService);
    shiftTypeService = TestBed.inject(ShiftTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const shiftType: IShiftType = { id: 456 };

      activatedRoute.data = of({ shiftType });
      comp.ngOnInit();

      expect(comp.shiftType).toEqual(shiftType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftType>>();
      const shiftType = { id: 123 };
      jest.spyOn(shiftTypeFormService, 'getShiftType').mockReturnValue(shiftType);
      jest.spyOn(shiftTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shiftType }));
      saveSubject.complete();

      // THEN
      expect(shiftTypeFormService.getShiftType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shiftTypeService.update).toHaveBeenCalledWith(expect.objectContaining(shiftType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftType>>();
      const shiftType = { id: 123 };
      jest.spyOn(shiftTypeFormService, 'getShiftType').mockReturnValue({ id: null });
      jest.spyOn(shiftTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shiftType }));
      saveSubject.complete();

      // THEN
      expect(shiftTypeFormService.getShiftType).toHaveBeenCalled();
      expect(shiftTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftType>>();
      const shiftType = { id: 123 };
      jest.spyOn(shiftTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shiftTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShiftService } from '../service/shift.service';
import { IShift } from '../shift.model';
import { ShiftFormService } from './shift-form.service';

import { ShiftUpdateComponent } from './shift-update.component';

describe('Shift Management Update Component', () => {
  let comp: ShiftUpdateComponent;
  let fixture: ComponentFixture<ShiftUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shiftFormService: ShiftFormService;
  let shiftService: ShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ShiftUpdateComponent],
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
      .overrideTemplate(ShiftUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shiftFormService = TestBed.inject(ShiftFormService);
    shiftService = TestBed.inject(ShiftService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const shift: IShift = { id: 456 };

      activatedRoute.data = of({ shift });
      comp.ngOnInit();

      expect(comp.shift).toEqual(shift);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShift>>();
      const shift = { id: 123 };
      jest.spyOn(shiftFormService, 'getShift').mockReturnValue(shift);
      jest.spyOn(shiftService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shift });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shift }));
      saveSubject.complete();

      // THEN
      expect(shiftFormService.getShift).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shiftService.update).toHaveBeenCalledWith(expect.objectContaining(shift));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShift>>();
      const shift = { id: 123 };
      jest.spyOn(shiftFormService, 'getShift').mockReturnValue({ id: null });
      jest.spyOn(shiftService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shift: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shift }));
      saveSubject.complete();

      // THEN
      expect(shiftFormService.getShift).toHaveBeenCalled();
      expect(shiftService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShift>>();
      const shift = { id: 123 };
      jest.spyOn(shiftService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shift });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shiftService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

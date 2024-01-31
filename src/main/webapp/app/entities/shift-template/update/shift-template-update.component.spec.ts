import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShiftTemplateService } from '../service/shift-template.service';
import { IShiftTemplate } from '../shift-template.model';
import { ShiftTemplateFormService } from './shift-template-form.service';

import { ShiftTemplateUpdateComponent } from './shift-template-update.component';

describe('ShiftTemplate Management Update Component', () => {
  let comp: ShiftTemplateUpdateComponent;
  let fixture: ComponentFixture<ShiftTemplateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shiftTemplateFormService: ShiftTemplateFormService;
  let shiftTemplateService: ShiftTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ShiftTemplateUpdateComponent],
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
      .overrideTemplate(ShiftTemplateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftTemplateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shiftTemplateFormService = TestBed.inject(ShiftTemplateFormService);
    shiftTemplateService = TestBed.inject(ShiftTemplateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const shiftTemplate: IShiftTemplate = { id: 456 };

      activatedRoute.data = of({ shiftTemplate });
      comp.ngOnInit();

      expect(comp.shiftTemplate).toEqual(shiftTemplate);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftTemplate>>();
      const shiftTemplate = { id: 123 };
      jest.spyOn(shiftTemplateFormService, 'getShiftTemplate').mockReturnValue(shiftTemplate);
      jest.spyOn(shiftTemplateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shiftTemplate }));
      saveSubject.complete();

      // THEN
      expect(shiftTemplateFormService.getShiftTemplate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shiftTemplateService.update).toHaveBeenCalledWith(expect.objectContaining(shiftTemplate));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftTemplate>>();
      const shiftTemplate = { id: 123 };
      jest.spyOn(shiftTemplateFormService, 'getShiftTemplate').mockReturnValue({ id: null });
      jest.spyOn(shiftTemplateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftTemplate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shiftTemplate }));
      saveSubject.complete();

      // THEN
      expect(shiftTemplateFormService.getShiftTemplate).toHaveBeenCalled();
      expect(shiftTemplateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftTemplate>>();
      const shiftTemplate = { id: 123 };
      jest.spyOn(shiftTemplateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shiftTemplateService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

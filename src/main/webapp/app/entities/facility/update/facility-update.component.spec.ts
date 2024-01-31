import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FacilityService } from '../service/facility.service';
import { IFacility } from '../facility.model';
import { FacilityFormService } from './facility-form.service';

import { FacilityUpdateComponent } from './facility-update.component';

describe('Facility Management Update Component', () => {
  let comp: FacilityUpdateComponent;
  let fixture: ComponentFixture<FacilityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let facilityFormService: FacilityFormService;
  let facilityService: FacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FacilityUpdateComponent],
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
      .overrideTemplate(FacilityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacilityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    facilityFormService = TestBed.inject(FacilityFormService);
    facilityService = TestBed.inject(FacilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const facility: IFacility = { id: 456 };

      activatedRoute.data = of({ facility });
      comp.ngOnInit();

      expect(comp.facility).toEqual(facility);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacility>>();
      const facility = { id: 123 };
      jest.spyOn(facilityFormService, 'getFacility').mockReturnValue(facility);
      jest.spyOn(facilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facility });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facility }));
      saveSubject.complete();

      // THEN
      expect(facilityFormService.getFacility).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(facilityService.update).toHaveBeenCalledWith(expect.objectContaining(facility));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacility>>();
      const facility = { id: 123 };
      jest.spyOn(facilityFormService, 'getFacility').mockReturnValue({ id: null });
      jest.spyOn(facilityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facility: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facility }));
      saveSubject.complete();

      // THEN
      expect(facilityFormService.getFacility).toHaveBeenCalled();
      expect(facilityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacility>>();
      const facility = { id: 123 };
      jest.spyOn(facilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facility });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(facilityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

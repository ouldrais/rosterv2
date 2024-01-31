import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { PositionService } from '../service/position.service';
import { IPosition } from '../position.model';
import { PositionFormService } from './position-form.service';

import { PositionUpdateComponent } from './position-update.component';

describe('Position Management Update Component', () => {
  let comp: PositionUpdateComponent;
  let fixture: ComponentFixture<PositionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let positionFormService: PositionFormService;
  let positionService: PositionService;
  let departmentService: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PositionUpdateComponent],
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
      .overrideTemplate(PositionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PositionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    positionFormService = TestBed.inject(PositionFormService);
    positionService = TestBed.inject(PositionService);
    departmentService = TestBed.inject(DepartmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Department query and add missing value', () => {
      const position: IPosition = { id: 456 };
      const department: IDepartment = { id: 6560 };
      position.department = department;

      const departmentCollection: IDepartment[] = [{ id: 17878 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ position });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining),
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const position: IPosition = { id: 456 };
      const department: IDepartment = { id: 19751 };
      position.department = department;

      activatedRoute.data = of({ position });
      comp.ngOnInit();

      expect(comp.departmentsSharedCollection).toContain(department);
      expect(comp.position).toEqual(position);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPosition>>();
      const position = { id: 123 };
      jest.spyOn(positionFormService, 'getPosition').mockReturnValue(position);
      jest.spyOn(positionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ position });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: position }));
      saveSubject.complete();

      // THEN
      expect(positionFormService.getPosition).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(positionService.update).toHaveBeenCalledWith(expect.objectContaining(position));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPosition>>();
      const position = { id: 123 };
      jest.spyOn(positionFormService, 'getPosition').mockReturnValue({ id: null });
      jest.spyOn(positionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ position: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: position }));
      saveSubject.complete();

      // THEN
      expect(positionFormService.getPosition).toHaveBeenCalled();
      expect(positionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPosition>>();
      const position = { id: 123 };
      jest.spyOn(positionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ position });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(positionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

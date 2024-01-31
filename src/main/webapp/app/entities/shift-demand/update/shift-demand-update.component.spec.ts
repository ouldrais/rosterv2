import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IShift } from 'app/entities/shift/shift.model';
import { ShiftService } from 'app/entities/shift/service/shift.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IShiftDemand } from '../shift-demand.model';
import { ShiftDemandService } from '../service/shift-demand.service';
import { ShiftDemandFormService } from './shift-demand-form.service';

import { ShiftDemandUpdateComponent } from './shift-demand-update.component';

describe('ShiftDemand Management Update Component', () => {
  let comp: ShiftDemandUpdateComponent;
  let fixture: ComponentFixture<ShiftDemandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shiftDemandFormService: ShiftDemandFormService;
  let shiftDemandService: ShiftDemandService;
  let shiftService: ShiftService;
  let taskService: TaskService;
  let positionService: PositionService;
  let departmentService: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ShiftDemandUpdateComponent],
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
      .overrideTemplate(ShiftDemandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftDemandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shiftDemandFormService = TestBed.inject(ShiftDemandFormService);
    shiftDemandService = TestBed.inject(ShiftDemandService);
    shiftService = TestBed.inject(ShiftService);
    taskService = TestBed.inject(TaskService);
    positionService = TestBed.inject(PositionService);
    departmentService = TestBed.inject(DepartmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shift query and add missing value', () => {
      const shiftDemand: IShiftDemand = { id: 456 };
      const shift: IShift = { id: 10903 };
      shiftDemand.shift = shift;

      const shiftCollection: IShift[] = [{ id: 193 }];
      jest.spyOn(shiftService, 'query').mockReturnValue(of(new HttpResponse({ body: shiftCollection })));
      const additionalShifts = [shift];
      const expectedCollection: IShift[] = [...additionalShifts, ...shiftCollection];
      jest.spyOn(shiftService, 'addShiftToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      expect(shiftService.query).toHaveBeenCalled();
      expect(shiftService.addShiftToCollectionIfMissing).toHaveBeenCalledWith(
        shiftCollection,
        ...additionalShifts.map(expect.objectContaining),
      );
      expect(comp.shiftsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Task query and add missing value', () => {
      const shiftDemand: IShiftDemand = { id: 456 };
      const task: ITask = { id: 6500 };
      shiftDemand.task = task;

      const taskCollection: ITask[] = [{ id: 697 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [task];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining),
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Position query and add missing value', () => {
      const shiftDemand: IShiftDemand = { id: 456 };
      const position: IPosition = { id: 1778 };
      shiftDemand.position = position;

      const positionCollection: IPosition[] = [{ id: 3841 }];
      jest.spyOn(positionService, 'query').mockReturnValue(of(new HttpResponse({ body: positionCollection })));
      const additionalPositions = [position];
      const expectedCollection: IPosition[] = [...additionalPositions, ...positionCollection];
      jest.spyOn(positionService, 'addPositionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      expect(positionService.query).toHaveBeenCalled();
      expect(positionService.addPositionToCollectionIfMissing).toHaveBeenCalledWith(
        positionCollection,
        ...additionalPositions.map(expect.objectContaining),
      );
      expect(comp.positionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Department query and add missing value', () => {
      const shiftDemand: IShiftDemand = { id: 456 };
      const department: IDepartment = { id: 24809 };
      shiftDemand.department = department;

      const departmentCollection: IDepartment[] = [{ id: 30542 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining),
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shiftDemand: IShiftDemand = { id: 456 };
      const shift: IShift = { id: 21004 };
      shiftDemand.shift = shift;
      const task: ITask = { id: 26647 };
      shiftDemand.task = task;
      const position: IPosition = { id: 1618 };
      shiftDemand.position = position;
      const department: IDepartment = { id: 28510 };
      shiftDemand.department = department;

      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      expect(comp.shiftsSharedCollection).toContain(shift);
      expect(comp.tasksSharedCollection).toContain(task);
      expect(comp.positionsSharedCollection).toContain(position);
      expect(comp.departmentsSharedCollection).toContain(department);
      expect(comp.shiftDemand).toEqual(shiftDemand);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftDemand>>();
      const shiftDemand = { id: 123 };
      jest.spyOn(shiftDemandFormService, 'getShiftDemand').mockReturnValue(shiftDemand);
      jest.spyOn(shiftDemandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shiftDemand }));
      saveSubject.complete();

      // THEN
      expect(shiftDemandFormService.getShiftDemand).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shiftDemandService.update).toHaveBeenCalledWith(expect.objectContaining(shiftDemand));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftDemand>>();
      const shiftDemand = { id: 123 };
      jest.spyOn(shiftDemandFormService, 'getShiftDemand').mockReturnValue({ id: null });
      jest.spyOn(shiftDemandService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftDemand: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shiftDemand }));
      saveSubject.complete();

      // THEN
      expect(shiftDemandFormService.getShiftDemand).toHaveBeenCalled();
      expect(shiftDemandService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShiftDemand>>();
      const shiftDemand = { id: 123 };
      jest.spyOn(shiftDemandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shiftDemand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shiftDemandService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareShift', () => {
      it('Should forward to shiftService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(shiftService, 'compareShift');
        comp.compareShift(entity, entity2);
        expect(shiftService.compareShift).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTask', () => {
      it('Should forward to taskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(taskService, 'compareTask');
        comp.compareTask(entity, entity2);
        expect(taskService.compareTask).toHaveBeenCalledWith(entity, entity2);
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IResource } from 'app/entities/resource/resource.model';
import { ResourceService } from 'app/entities/resource/service/resource.service';
import { ITraining } from 'app/entities/training/training.model';
import { TrainingService } from 'app/entities/training/service/training.service';
import { IResourceTraining } from '../resource-training.model';
import { ResourceTrainingService } from '../service/resource-training.service';
import { ResourceTrainingFormService } from './resource-training-form.service';

import { ResourceTrainingUpdateComponent } from './resource-training-update.component';

describe('ResourceTraining Management Update Component', () => {
  let comp: ResourceTrainingUpdateComponent;
  let fixture: ComponentFixture<ResourceTrainingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let resourceTrainingFormService: ResourceTrainingFormService;
  let resourceTrainingService: ResourceTrainingService;
  let resourceService: ResourceService;
  let trainingService: TrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ResourceTrainingUpdateComponent],
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
      .overrideTemplate(ResourceTrainingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourceTrainingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resourceTrainingFormService = TestBed.inject(ResourceTrainingFormService);
    resourceTrainingService = TestBed.inject(ResourceTrainingService);
    resourceService = TestBed.inject(ResourceService);
    trainingService = TestBed.inject(TrainingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Resource query and add missing value', () => {
      const resourceTraining: IResourceTraining = { id: 456 };
      const resource: IResource = { id: 13555 };
      resourceTraining.resource = resource;

      const resourceCollection: IResource[] = [{ id: 19543 }];
      jest.spyOn(resourceService, 'query').mockReturnValue(of(new HttpResponse({ body: resourceCollection })));
      const additionalResources = [resource];
      const expectedCollection: IResource[] = [...additionalResources, ...resourceCollection];
      jest.spyOn(resourceService, 'addResourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourceTraining });
      comp.ngOnInit();

      expect(resourceService.query).toHaveBeenCalled();
      expect(resourceService.addResourceToCollectionIfMissing).toHaveBeenCalledWith(
        resourceCollection,
        ...additionalResources.map(expect.objectContaining),
      );
      expect(comp.resourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Training query and add missing value', () => {
      const resourceTraining: IResourceTraining = { id: 456 };
      const training: ITraining = { id: 3226 };
      resourceTraining.training = training;

      const trainingCollection: ITraining[] = [{ id: 20914 }];
      jest.spyOn(trainingService, 'query').mockReturnValue(of(new HttpResponse({ body: trainingCollection })));
      const additionalTrainings = [training];
      const expectedCollection: ITraining[] = [...additionalTrainings, ...trainingCollection];
      jest.spyOn(trainingService, 'addTrainingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourceTraining });
      comp.ngOnInit();

      expect(trainingService.query).toHaveBeenCalled();
      expect(trainingService.addTrainingToCollectionIfMissing).toHaveBeenCalledWith(
        trainingCollection,
        ...additionalTrainings.map(expect.objectContaining),
      );
      expect(comp.trainingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const resourceTraining: IResourceTraining = { id: 456 };
      const resource: IResource = { id: 13578 };
      resourceTraining.resource = resource;
      const training: ITraining = { id: 3193 };
      resourceTraining.training = training;

      activatedRoute.data = of({ resourceTraining });
      comp.ngOnInit();

      expect(comp.resourcesSharedCollection).toContain(resource);
      expect(comp.trainingsSharedCollection).toContain(training);
      expect(comp.resourceTraining).toEqual(resourceTraining);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourceTraining>>();
      const resourceTraining = { id: 123 };
      jest.spyOn(resourceTrainingFormService, 'getResourceTraining').mockReturnValue(resourceTraining);
      jest.spyOn(resourceTrainingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourceTraining });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resourceTraining }));
      saveSubject.complete();

      // THEN
      expect(resourceTrainingFormService.getResourceTraining).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(resourceTrainingService.update).toHaveBeenCalledWith(expect.objectContaining(resourceTraining));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourceTraining>>();
      const resourceTraining = { id: 123 };
      jest.spyOn(resourceTrainingFormService, 'getResourceTraining').mockReturnValue({ id: null });
      jest.spyOn(resourceTrainingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourceTraining: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resourceTraining }));
      saveSubject.complete();

      // THEN
      expect(resourceTrainingFormService.getResourceTraining).toHaveBeenCalled();
      expect(resourceTrainingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourceTraining>>();
      const resourceTraining = { id: 123 };
      jest.spyOn(resourceTrainingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourceTraining });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resourceTrainingService.update).toHaveBeenCalled();
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

    describe('compareTraining', () => {
      it('Should forward to trainingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(trainingService, 'compareTraining');
        comp.compareTraining(entity, entity2);
        expect(trainingService.compareTraining).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

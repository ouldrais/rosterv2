import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../resource.test-samples';

import { ResourceFormService } from './resource-form.service';

describe('Resource Form Service', () => {
  let service: ResourceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceFormService);
  });

  describe('Service methods', () => {
    describe('createResourceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResourceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            teamRole: expect.any(Object),
            exchangeAllowed: expect.any(Object),
            team: expect.any(Object),
          }),
        );
      });

      it('passing IResource should create a new form with FormGroup', () => {
        const formGroup = service.createResourceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            teamRole: expect.any(Object),
            exchangeAllowed: expect.any(Object),
            team: expect.any(Object),
          }),
        );
      });
    });

    describe('getResource', () => {
      it('should return NewResource for default Resource initial value', () => {
        const formGroup = service.createResourceFormGroup(sampleWithNewData);

        const resource = service.getResource(formGroup) as any;

        expect(resource).toMatchObject(sampleWithNewData);
      });

      it('should return NewResource for empty Resource initial value', () => {
        const formGroup = service.createResourceFormGroup();

        const resource = service.getResource(formGroup) as any;

        expect(resource).toMatchObject({});
      });

      it('should return IResource', () => {
        const formGroup = service.createResourceFormGroup(sampleWithRequiredData);

        const resource = service.getResource(formGroup) as any;

        expect(resource).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResource should not enable id FormControl', () => {
        const formGroup = service.createResourceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResource should disable id FormControl', () => {
        const formGroup = service.createResourceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

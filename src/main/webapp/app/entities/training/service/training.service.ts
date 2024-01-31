import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITraining, NewTraining } from '../training.model';

export type PartialUpdateTraining = Partial<ITraining> & Pick<ITraining, 'id'>;

export type EntityResponseType = HttpResponse<ITraining>;
export type EntityArrayResponseType = HttpResponse<ITraining[]>;

@Injectable({ providedIn: 'root' })
export class TrainingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trainings');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(training: NewTraining): Observable<EntityResponseType> {
    return this.http.post<ITraining>(this.resourceUrl, training, { observe: 'response' });
  }

  update(training: ITraining): Observable<EntityResponseType> {
    return this.http.put<ITraining>(`${this.resourceUrl}/${this.getTrainingIdentifier(training)}`, training, { observe: 'response' });
  }

  partialUpdate(training: PartialUpdateTraining): Observable<EntityResponseType> {
    return this.http.patch<ITraining>(`${this.resourceUrl}/${this.getTrainingIdentifier(training)}`, training, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITraining>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITraining[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTrainingIdentifier(training: Pick<ITraining, 'id'>): number {
    return training.id;
  }

  compareTraining(o1: Pick<ITraining, 'id'> | null, o2: Pick<ITraining, 'id'> | null): boolean {
    return o1 && o2 ? this.getTrainingIdentifier(o1) === this.getTrainingIdentifier(o2) : o1 === o2;
  }

  addTrainingToCollectionIfMissing<Type extends Pick<ITraining, 'id'>>(
    trainingCollection: Type[],
    ...trainingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const trainings: Type[] = trainingsToCheck.filter(isPresent);
    if (trainings.length > 0) {
      const trainingCollectionIdentifiers = trainingCollection.map(trainingItem => this.getTrainingIdentifier(trainingItem)!);
      const trainingsToAdd = trainings.filter(trainingItem => {
        const trainingIdentifier = this.getTrainingIdentifier(trainingItem);
        if (trainingCollectionIdentifiers.includes(trainingIdentifier)) {
          return false;
        }
        trainingCollectionIdentifiers.push(trainingIdentifier);
        return true;
      });
      return [...trainingsToAdd, ...trainingCollection];
    }
    return trainingCollection;
  }
}

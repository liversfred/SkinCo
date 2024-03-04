import { Injectable } from '@angular/core';
import { TrailService } from '../trail.service';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Collections } from 'src/app/constants/collections.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Specialization } from 'src/app/models/speicialization.model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationSeederService {
  private collection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _trailService: TrailService) {
    this.collection = collection(this._fireStore, Collections.SPECIALIZATIONS);
  }

  async seedData() {
    const dataToSeed: Specialization[] = [
      { 
        name: "Dermatology",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Dermatology`)
      },
      { 
        name: "Aesthetic Medicine",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Aesthetic Medicine`)
      },
      { 
        name: "Medical Aesthetics",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Medical Aesthetics`)
      },
      { 
        name: "Cosmetic Dermatology",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Cosmetic Dermatology`)
      },
      { 
        name: "Esthetics",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Esthetics`)
      },
      { 
        name: "Laser Therapy",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Laser Therapy`)
      },
      { 
        name: "Holistic Skincare",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Holistic Skincare`)
      },
      { 
        name: "Clinical Skincare",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Clinical Skincare`)
      },
      { 
        name: "Spa Therapy",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Spa Therapy`)
      },
      { 
        name: "Paramedical Skincare",  ...this._trailService.createAudit(`${ModifierActions.CREATED} Specialization Paramedical Skincare`)
      },
    ];

    console.log("SEEDING SPECIALIZATIONS DATA");
    dataToSeed.forEach(async (item) => {
      await addDoc(this.collection, item)
        .then(() => console.log('Specialization seeded successfully'))
        .catch(error => console.error('Error seeding data', error));
    });
  }
}

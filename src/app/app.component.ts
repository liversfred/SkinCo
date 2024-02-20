import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeederService } from './services/seeders/seeder.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private _seederService: SeederService) {}

  ngOnInit(): void {
    if(environment.seedData) this._seederService.seedAll();
  }
}

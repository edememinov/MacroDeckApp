import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MacrodeckOptionsService } from '../services/macrodeck-options.service';
import { MacroDeckOptions } from '../models/macrodeck-options'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-macro-deck-options',
  templateUrl: './macro-deck-options.component.html',
  styleUrls: ['./macro-deck-options.component.scss'],
  providers : [MacrodeckOptionsService]
})
export class MacroDeckOptionsComponent implements OnInit {

  macrodeckOptions: FormGroup;
  options: Observable<MacroDeckOptions>;

  constructor(private formBuilder: FormBuilder, private optionsService: MacrodeckOptionsService) { }

  ngOnInit(): void {
    this.macrodeckOptions = this.formBuilder.group({
      fingerprint: new FormControl(''),
      socketHost: new FormControl(''),
      socketPort: new FormControl(''),
      development: new FormControl(''),
      calibrationMode: new FormControl(''),
      buttonCount: new FormControl(''),
      maxButtonCurrent: new FormControl(''),
      server: new FormControl('')

    });

    this.options = this.optionsService.getOptions().pipe(
      tap(options => this.macrodeckOptions.patchValue(options))

    );
    console.log(this.options);
  }

  submit() {
    if (!this.macrodeckOptions.valid) {
      return;
    }
    this.optionsService.setOptions(this.macrodeckOptions.value);
    console.log(this.macrodeckOptions.value);
  }

}



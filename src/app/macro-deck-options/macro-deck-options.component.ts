import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MacrodeckOptionsService } from '../services/macrodeck-options.service';
import { MacroDeckOptions } from '../models/macrodeck-options'
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-macro-deck-options',
  templateUrl: './macro-deck-options.component.html',
  styleUrls: ['./macro-deck-options.component.scss'],
  providers : [MacrodeckOptionsService]
})
export class MacroDeckOptionsComponent implements OnInit, OnDestroy {

  macrodeckOptions: FormGroup;
  options: Observable<MacroDeckOptions>;
  unsubscriber = new Subject()

  constructor(private formBuilder: FormBuilder, private optionsService: MacrodeckOptionsService) { }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.macrodeckOptions = this.formBuilder.group({
      fingerprint: new FormControl(''),
      socketHost: new FormControl(''),
      socketPort: new FormControl(''),
      development: new FormControl(''),
      calibrationMode: new FormControl(''),
      buttonCount: new FormControl(''),
      maxButtonAmp: new FormControl(''),
      server: new FormControl('')
    });

    this.options = this.optionsService.getOptions().pipe(
      tap(options => this.macrodeckOptions.patchValue(options), takeUntil(this.unsubscriber))
    );

  }

  submit() {
    if (!this.macrodeckOptions.valid) {
      return;
    }
    this.optionsService.setOptions(this.macrodeckOptions.value).pipe();
    console.log(this.macrodeckOptions.value);
  }

}



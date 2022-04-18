import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { throws } from 'assert';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElectronService } from '../core/services';
import { MacrodeckButtonOptionsService } from '../services/macrodeck-button-options.service';
import { MacrodeckOptionsService } from '../services/macrodeck-options.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-macro-deck-button-options',
  templateUrl: './macro-deck-button-options.component.html',
  styleUrls: ['./macro-deck-button-options.component.scss']
})
export class MacroDeckButtonOptionsComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder,
    private buttonOptionsService: MacrodeckButtonOptionsService,
    private _electron:ElectronService,
    private optionsService: MacrodeckOptionsService,
    private snackBarService: SnackbarService) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  macrodeckButtonOptions: FormGroup;
  formArray: FormArray = new FormArray([]);
  unsubscribe = new Subject();
  
  ngOnInit(): void {
    let buttons: FormArray = new FormArray([]);
    this.optionsService.getOptions(this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscribe)).subscribe(options =>  {
      this.buttonOptionsService.getOptions(this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscribe)).subscribe(data => {   
        console.log(options);
        for(let i = 0;i < options.buttonCount;i++){
          buttons.push(
            this.formBuilder.group({
            buttonValue: this.formBuilder.control(''),
            minValue: this.formBuilder.control(''),
            maxValue: this.formBuilder.control('')
          })
          );
        }
  
        this.macrodeckButtonOptions = new FormGroup({
          defaultValue: new FormControl(''),
          buttons
        });
        this.formArray = this.macrodeckButtonOptions.get('buttons') as FormArray;
        this.macrodeckButtonOptions.patchValue(data);
      });
    })
    

    


    
    
  }

  submit(){
    this.buttonOptionsService.setOptions(this.macrodeckButtonOptions.value, this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscribe)).subscribe(value => {
      this.snackBarService.showGenericSnackBar('Options have been saved', true)
    }, error => {
      this.snackBarService.showGenericSnackBar('An error has occured when saving the options', false)
    });
  }

}

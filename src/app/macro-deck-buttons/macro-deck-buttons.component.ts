import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as _ from 'lodash/';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MacrodeckButtonService } from '../services/macrodeck-button.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-macro-deck-buttons',
  templateUrl: './macro-deck-buttons.component.html',
  styleUrls: ['./macro-deck-buttons.component.scss']
})
export class MacroDeckButtonsComponent implements OnInit, OnDestroy {

  buttonFile = {
    "buttons": [
        {
            "command_id": 1,
            "type": "socket",
            "description": "Test1234"
        }
    ]
};

pageFile = {
  "pages": [
    {
      "name": "URL Saver",
      "buttons": [
        {
          "command_id": 130,
          "type": "socket",
          "description": "Reload"
        }
      ]
    }
  ]
}
 
  allAvailableFilter:string;
  onDeviceFilter: string;
  selectedFile: any;
  dummy = 0;
  pageName = '';
  pageNumber = 0 ;
  fileName = '';
  unsubscriber$ = new Subject();
  allFiles: string[];
  addPage = false;
  addFile = false;
  addFormGroup : FormGroup;
  createdFileName: string = null;
  constructor(private formBuilder: FormBuilder, private _electron:ElectronService, private buttonService : MacrodeckButtonService, private snackBarService: SnackbarService) { }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  searchControl = new FormControl();
  fileControl = new FormControl();

  filteredOptionsPage$: Observable<any>;
  filteredOptionsFile$: Observable<any>;

  private _filterPageFile(value: string) {
    const filterValue = value.toLowerCase();
    return _.filter(this.pageFile.pages, (value) => value.name.toLowerCase().includes(filterValue))
  }

  private _filterFiles(array: string[], value: string) {
    const filterValue = value.toLowerCase();
    return _.filter(array, (value) => value.toLowerCase().includes(filterValue))
  }
  
  ngOnInit(): void {

    this.addFormGroup = this.formBuilder.group({
      name: new FormControl(''),
    });
    
    this.buttonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readMacrodeckData', ''));
    this.buttonService.getAllFiles().pipe(takeUntil(this.unsubscriber$)).subscribe((value) => {
      if(value){
        this.fileControl.setValue(value[0]);
        this.selectedFile = value[0];
        this.getFile(value[0]);
        this.filteredOptionsFile$ = this.fileControl.valueChanges.pipe(
          startWith(''),
          map(data => this._filterFiles(value, data)),
        );
      }
    })

    
  }
  addPageEnable(){
    if(!this.addFile){
      this.addPage = true;
    }
    else{
      this.addPage = true;
      this.addFile = false;
    }
  }

  addFileEnable(){
    if(!this.addPage){
      this.addFile = true;
    }
    else{
      this.addPage = false;
      this.addFile = true;
    }
  }
  addPageOrFile(){
    if(this.addFile){
      this.buttonService.createNewFile({fileName: this.addFormGroup.controls.name.value},  this._electron.ipcRenderer.sendSync('readUrl', '')).subscribe(value =>{
        this.createdFileName = this.addFormGroup.controls.name.value;
        this.addPageEnable();
        this.snackBarService.showGenericSnackBar('File has been added', true)
    },
    error => {
      console.log(error);
    });
    }
    else if(this.addPage){
      if(this.createdFileName !== null){
        this.buttonService.editFile(
          { 
            pages: [{name: this.addFormGroup.controls.name.value, buttons: []}], fileName: this.createdFileName
          }, 
          this._electron.ipcRenderer.sendSync('readUrl', '')).subscribe(value =>{
            //window.location.reload();
            this.createdFileName = null;
        },
        error => {
          console.log(error);
        })
      }
      else{
        this.pageFile.pages.push({name: this.addFormGroup.controls.name.value, buttons: []});
        this.buttonService.editFile(
          { 
            pages: this.pageFile.pages, fileName: this.fileName
          }, 
          this._electron.ipcRenderer.sendSync('readUrl', '')).subscribe(value =>{
            //window.location.reload();
        },
        error => {
          console.log(error);
        })
      }
      this.snackBarService.showGenericSnackBar('Page has been added', true)
    }
  }

  submit(){
    this.buttonService.editFile(
      { 
        pages: this.pageFile.pages, fileName: this.fileName
      }, 
      this._electron.ipcRenderer.sendSync('readUrl', ''))
      .pipe(takeUntil(this.unsubscriber$)).subscribe(value =>{
        //window.location.reload();
    },
    error => {
      this.snackBarService.showGenericSnackBar('An error has occured when saving the configuration', false)
    })
    this.snackBarService.showGenericSnackBar('Configuration has been saved', true)
  }

  updateButton($event){
    let foundIndex = _.findIndex(this.buttonFile.buttons, $event.oldItem);
    this.buttonFile.buttons[foundIndex] = $event.button;
    this._electron.ipcRenderer.sendSync('writeMacrodeckData', JSON.stringify(this.buttonFile));
  }

  setPage(pageName){
    this.pageName = pageName;
    this.selectedFile = _.find(this.pageFile.pages, (value) => value.name === pageName)
    this.pageNumber = _.findIndex(this.pageFile.pages, this.selectedFile);
  }

  getFile(fileName){
    this.fileName = fileName;
    this.buttonService.getFile(fileName, this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber$)).subscribe(data => {
      this.pageFile = data;
      this.searchControl.setValue(this.pageFile.pages[0].name);
      this.filteredOptionsPage$ = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPageFile(value)),
      );
    })
  }
  

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log(event);
      this.moveWithinArray(event.previousContainer.data[event.previousIndex], event.previousContainer.data[event.currentIndex] ,event.previousContainer.id);
    } else {
      this.moveOtherToArray(event.previousContainer.data[event.previousIndex], event.previousContainer.id, event.currentIndex)
    }
    this.dummy++;
  }

  moveOtherToArray(item, previousContainer, newIndex){
    if(previousContainer === 'cdk-drop-list-1'){
      let foundIndex = _.findIndex(this.buttonFile.buttons, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(newIndex, 0, item)
      this.buttonFile.buttons.splice(foundIndex, 1);
    }
    else{
      let foundIndex = _.findIndex(this.pageFile.pages[0].buttons, item);
      this.buttonFile.buttons.splice(newIndex, 0, item)
      this.pageFile.pages[this.pageNumber].buttons.splice(foundIndex, 1);
    }
  }

  moveWithinArray(newitem, oldItem, previousContainer){
    if(previousContainer === 'cdk-drop-list-1'){
      let newIndex = _.findIndex(this.buttonFile.buttons, oldItem);
      let oldIndex = _.findIndex(this.buttonFile.buttons, newitem)
      this.move(this.buttonFile.buttons, oldIndex, newIndex);
    }
    else{
      let newIndex = _.findIndex(this.pageFile.pages[this.pageNumber].buttons, oldItem);
      let oldIndex = _.findIndex(this.pageFile.pages[this.pageNumber].buttons, newitem);
      this.move(this.pageFile.pages[this.pageNumber].buttons, oldIndex, newIndex);
      
    }
  }

  private move(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  };

}

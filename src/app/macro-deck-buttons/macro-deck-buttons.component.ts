import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as _ from 'lodash/';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MacrodeckButtonService } from '../services/macrodeck-button.service';
import { SnackbarService } from '../services/snackbar.service';
import { ReloaderService } from '../services/reloader.service';

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
  deleteList = [];
  constructor(private formBuilder: FormBuilder, private _electron:ElectronService, private buttonService : MacrodeckButtonService, private snackBarService: SnackbarService, private reloaderService: ReloaderService) { }

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
      fileName: new FormControl(''),
      pageName: new FormControl(''),
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

  addPageOrFile(waitForPageName: boolean){
    if(waitForPageName){
      return;
    }
    if(this.addFormGroup.controls.fileName.value){
      this.buttonService.createNewFile(
        { 
          pages: [{name: this.addFormGroup.controls.pageName.value, buttons: []}], fileName: this.addFormGroup.controls.fileName.value.toString().toLowerCase()
        }, 
        this._electron.ipcRenderer.sendSync('readUrl', '')).subscribe(value =>{
          this.createdFileName = null;
      },
      error => {
        console.log(error);
        this.snackBarService.showGenericSnackBar('Page could not be added', false)
      })
      this.snackBarService.showGenericSnackBar('Page has been added', true)   
    }
    else{
      this.pageFile.pages.push({name: this.addFormGroup.controls.pageName.value, buttons: []});
        this.buttonService.editFile(
          { 
            pages: this.pageFile.pages, fileName: this.fileName
          }, 
          this._electron.ipcRenderer.sendSync('readUrl', '')).subscribe(value =>{
            
        },
        error => {
          console.log(error);
          this.snackBarService.showGenericSnackBar('Page could not be added', false)
        })

        this.snackBarService.showGenericSnackBar('Page has been added', true)
    }

    this.reloaderService.reloadAppAfterThreeSeconds(this.unsubscriber$);
    
  }

  submit(){
    this.buttonService.editFile(
      { 
        pages: this.pageFile.pages, fileName: this.fileName
      }, 
      this._electron.ipcRenderer.sendSync('readUrl', ''))
      .pipe(takeUntil(this.unsubscriber$)).subscribe(value =>{
        this.reloaderService.reloadAppAfterThreeSeconds(this.unsubscriber$);
    },
    error => {
      this.snackBarService.showGenericSnackBar('An error has occured when saving the configuration', false)
    })
    this.snackBarService.showGenericSnackBar('Configuration has been saved', true)
    this.reloaderService.reloadAppAfterThreeSeconds(this.unsubscriber$);
  }

  deleteFileConfirmation($event){
    if($event){
      this.deleteFile();
    }
  }

  deletePageConfirmation($event){
    if($event){
      this.deletePage();
    }
  }

  setPageNameInPopOver(){
    this.addFormGroup.controls.pageName.patchValue(this.pageName);
  }

  editPageName(){
    this.pageFile.pages[this.pageNumber].name = this.addFormGroup.controls.pageName.value;
    this.submit();
  }

  deleteFile(){
    this.buttonService.deleteFile({fileName: this.fileName}, this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber$)).subscribe(data =>{
      this.snackBarService.showGenericSnackBar('File has been deleted', true)
      this.reloaderService.reloadAppAfterThreeSeconds(this.unsubscriber$);
    },
    error => {
      this.snackBarService.showGenericSnackBar('File could not be deleted', false)
    })
  }

  deletePage(){
    this.pageFile.pages.splice(this.pageNumber, 1);
    this.submit();
  }

  deleteButton($event){
    let foundIndex = _.findIndex(this.buttonFile.buttons, $event.button);
    this.buttonFile.buttons.splice(foundIndex, 1);
    this._electron.ipcRenderer.sendSync('writeMacrodeckData', JSON.stringify(this.buttonFile));
    this.snackBarService.showGenericSnackBar('Button has been deleted', true)
    this.reloaderService.reloadAppAfterThreeSeconds(this.unsubscriber$);
  }

  updateButton($event){
    let foundIndex = _.findIndex(this.buttonFile.buttons, $event.oldItem);
    this.buttonFile.buttons[foundIndex] = $event.button;
    this._electron.ipcRenderer.sendSync('writeMacrodeckData', JSON.stringify(this.buttonFile));
    this.reloaderService.reloadAppAfterThreeSeconds(this.unsubscriber$);
  }

  setPage(pageName){
    this.pageName = pageName;
    this.selectedFile = _.find(this.pageFile.pages, (value) => value.name === pageName)
    this.pageNumber = _.findIndex(this.pageFile.pages, this.selectedFile);
    this.buttonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readMacrodeckData', ''));
  }

  getFile(fileName){
    this.fileName = fileName;
    this.buttonService.getFile(fileName, this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber$)).subscribe(data => {
      this.pageFile = data;
      this.pageName = this.pageFile.pages[0].name;
      this.pageNumber = 0;
      this.searchControl.setValue(this.pageFile.pages[0].name);
      this.filteredOptionsPage$ = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPageFile(value)),
      );
    })
    this.buttonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readMacrodeckData', ''));
  }
  

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      this.moveWithinArray(event.previousContainer.data[event.previousIndex], event.previousContainer.data[event.currentIndex] ,event.previousContainer.id);
    } else {
      this.moveOtherToArray(event.previousContainer.data[event.previousIndex], event.previousContainer.id, event.currentIndex, event.container.id)
    }
    this.dummy++;
  }

  moveOtherToArray(item, previousContainer, newIndex, newContainer){
    //From OnDevice to All Available buttons
    if(previousContainer === 'cdk-drop-list-1' && newContainer === 'cdk-drop-list-2'){
      let foundIndex = _.findIndex(this.pageFile.pages[0].buttons, item);
      this.buttonFile.buttons.splice(newIndex, 0, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(foundIndex, 1)
    }
    //From OnDevice to Delete
    else if(previousContainer === 'cdk-drop-list-1' && newContainer === 'cdk-drop-list-0'){
      let foundIndex = _.findIndex(this.pageFile.pages[0].buttons, item);
      this.deleteList.splice(newIndex, 0, item)
      this.pageFile.pages[this.pageNumber].buttons.splice(foundIndex, 1);
    }
    //From All Available buttons to OnDevice
    else if(previousContainer === 'cdk-drop-list-2' && newContainer === 'cdk-drop-list-1'){
      let foundIndex = _.findIndex(this.buttonFile.buttons, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(newIndex, 0, item)
      this.buttonFile.buttons.splice(foundIndex, 1);
    }
    //From delete to OnDevice
    else if(previousContainer === 'cdk-drop-list-0' && newContainer === 'cdk-drop-list-1'){
      let foundIndex = _.findIndex(this.deleteList, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(newIndex, 0, item)
      this.deleteList.splice(foundIndex, 1);
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

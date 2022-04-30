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
import { random } from 'lodash/';

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

backUpButtonFile = {
  "buttons": [
      {
          "command_id": 1,
          "type": "socket",
          "description": "Test1234"
      }
  ]
};

customButtonFile = {
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
  containerIdOnDevice = 'id-on-device';
  containerIdDelete = 'id-delete';
  containerIdAllButtons = 'id-all-buttons';
  constructor(private formBuilder: FormBuilder, private _electron:ElectronService, private buttonService : MacrodeckButtonService, private snackBarService: SnackbarService, private reloaderService: ReloaderService) 
  { 
    let henk = random();
    console.log("I AM DOING MY PART AS WELL", henk);
  }

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

    console.log("I AM DOING MY PART");

    this.readButtons();

    this.addFormGroup = this.formBuilder.group({
      fileName: new FormControl(''),
      pageName: new FormControl(''),
    });
    
    
    
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

  readButtons(){
    this.buttonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readMacrodeckData', ''));
    this.backUpButtonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readMacrodeckData', ''));
    this.customButtonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readCustomMacrodeckData', ''));
    this.customButtonFile.buttons.forEach((button) =>{
      this.buttonFile.buttons.push(button); 
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

    //this.reloaderService.reloadAppAfterThreeSeconds();
    
  }

  submit(){
    this.buttonService.editFile(
      { 
        pages: this.pageFile.pages, fileName: this.fileName
      }, 
      this._electron.ipcRenderer.sendSync('readUrl', ''))
      .pipe(takeUntil(this.unsubscriber$)).subscribe(value =>{
        //this.reloaderService.reloadAppAfterThreeSeconds();
    },
    error => {
      this.snackBarService.showGenericSnackBar('An error has occured when saving the configuration', false)
    })
    this.snackBarService.showGenericSnackBar('Configuration has been saved', true)
    //this.reloaderService.reloadAppAfterThreeSeconds();
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
      //this.reloaderService.reloadAppAfterThreeSeconds();
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
    console.log($event);
    $event.button.type !== 'macrodeckCall'
      ? this.deleteSpecificButton('writeCustomMacrodeckData', this.customButtonFile, $event)
      : this.deleteSpecificButton('writeMacrodeckData', this.backUpButtonFile, $event);

      this.readButtons();
  }

  updateButton($event){
    console.log($event);
    $event.oldItem.type !== 'macrodeckCall'
      ? this.updateSpecificButton('writeCustomMacrodeckData', this.customButtonFile, $event)
      : this.updateSpecificButton('writeMacrodeckData', this.backUpButtonFile, $event);
      this.readButtons();
  }

  updateSpecificButton(sendName: string, file: any, $event: any){
    let foundIndex = _.findIndex(file.buttons, $event.oldItem);
    file.buttons[foundIndex] = $event.button;
    this._electron.ipcRenderer.sendSync(sendName, JSON.stringify(file));
    //this.reloaderService.reloadAppAfterThreeSeconds();
  }

  deleteSpecificButton(sendName: string, file: any, $event: any){
    let foundIndex = _.findIndex(file.buttons, $event.button);
    file.buttons.splice(foundIndex, 1);
    this._electron.ipcRenderer.sendSync(sendName, JSON.stringify(file));
    this.snackBarService.showGenericSnackBar('Button has been deleted', true)
  }

  setPage(pageName){
    this.pageName = pageName;
    this.selectedFile = _.find(this.pageFile.pages, (value) => value.name === pageName)
    this.pageNumber = _.findIndex(this.pageFile.pages, this.selectedFile);
    this.readButtons();
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
    this.readButtons();
  }
  

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    console.log(event.previousContainer.id, event.container.id);
    if (event.previousContainer === event.container) {
      this.moveWithinArray(event.previousContainer.data[event.previousIndex], event.previousContainer.data[event.currentIndex] ,event.previousContainer.id);
    } else {
      this.moveOtherToArray(event.previousContainer.data[event.previousIndex], event.previousContainer.id, event.currentIndex, event.container.id)
    }
    this.dummy++;
  }

  moveOtherToArray(item, previousContainer, newIndex, newContainer){
    //From OnDevice to All Available buttons
    if(previousContainer === this.containerIdOnDevice && newContainer === this.containerIdAllButtons){
      let foundIndex = _.findIndex(this.pageFile.pages[0].buttons, item);
      this.buttonFile.buttons.splice(newIndex, 0, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(foundIndex, 1)
    }
    //From OnDevice to Delete
    else if(previousContainer === this.containerIdOnDevice && newContainer === this.containerIdDelete){
      let foundIndex = _.findIndex(this.pageFile.pages[0].buttons, item);
      this.deleteList.splice(newIndex, 0, item)
      this.pageFile.pages[this.pageNumber].buttons.splice(foundIndex, 1);
    }
    //From All Available buttons to OnDevice
    else if(previousContainer === this.containerIdAllButtons && newContainer === this.containerIdOnDevice){
      let foundIndex = _.findIndex(this.buttonFile.buttons, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(newIndex, 0, item)
      this.buttonFile.buttons.splice(foundIndex, 1);
    }
    //From delete to OnDevice
    else if(previousContainer === this.containerIdDelete && newContainer === this.containerIdOnDevice){
      let foundIndex = _.findIndex(this.deleteList, item);
      this.pageFile.pages[this.pageNumber].buttons.splice(newIndex, 0, item)
      this.deleteList.splice(foundIndex, 1);
    }
  }

  moveWithinArray(newitem, oldItem, previousContainer){
    if(previousContainer === this.containerIdAllButtons){
      let newIndex = _.findIndex(this.buttonFile.buttons, oldItem);
      let oldIndex = _.findIndex(this.buttonFile.buttons, newitem)
      this.move(this.buttonFile.buttons, oldIndex, newIndex);
    }
    else if(previousContainer === this.containerIdOnDevice){
      let newIndex = _.findIndex(this.pageFile.pages[this.pageNumber].buttons, oldItem);
      let oldIndex = _.findIndex(this.pageFile.pages[this.pageNumber].buttons, newitem);
      this.move(this.pageFile.pages[this.pageNumber].buttons, oldIndex, newIndex);
      
    }
  }

  private move(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  };

}

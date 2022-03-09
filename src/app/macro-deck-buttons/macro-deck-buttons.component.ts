import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as _ from 'lodash/';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MacrodeckButtonService } from '../services/macrodeck-button.service';

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
        },
        {
            "command_id": 2,
            "type": "socket",
            "description": "Sup bro"
        },
        {
            "command_id": 3,
            "type": "socket",
            "description": "Hi man"
        },
        {
            "command_id": 4,
            "type": "socket",
            "description": "Whatas upos"
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
        },
        {
          "command_id": 46,
          "type": "socket",
          "description": "Hide"
        },
        {
          "command_id": 57,
          "type": "socket",
          "description": "Close"
        },
        {
          "url": "https://maker.ifttt.com/trigger/bedroomlighttoggle/with/key/fJOlW0DpSuY_h4auJ1l05",
          "type": "apiCall",
          "description": "Toggle bedroom light"
        },
        {
          "url": "https://maker.ifttt.com/trigger/toggleLedStrip/with/key/fJOlW0DpSuY_h4auJ1l05",
          "type": "apiCall",
          "description": "Ledstrip on"
        },
        {
          "url": "https://maker.ifttt.com/trigger/toggleLedStrip/with/key/fJOlW0DpSuY_h4auJ1l05",
          "type": "apiCall",
          "description": "Ik eet kaas",
          "fingerprint": "ik eet kaas"
        }
      ]
    },{
      "name": "Test1",
      "buttons": [
        {
          "command_id": 130,
          "type": "socket",
          "description": "Flauw"
        },
        {
          "command_id": 46,
          "type": "socket",
          "description": "Kaas"
        },
        {
          "command_id": 57,
          "type": "socket",
          "description": "Paarden"
        },
        {
          "url": "https://maker.ifttt.com/trigger/bedroomlighttoggle/with/key/fJOlW0DpSuY_h4auJ1l05",
          "type": "apiCall",
          "description": "Worst"
        },
        {
          "url": "https://maker.ifttt.com/trigger/toggleLedStrip/with/key/fJOlW0DpSuY_h4auJ1l05",
          "type": "apiCall",
          "description": "Appelsap"
        },
        {
          "url": "https://maker.ifttt.com/trigger/toggleLedStrip/with/key/fJOlW0DpSuY_h4auJ1l05",
          "type": "apiCall",
          "description": "Ik eet kaas",
          "fingerprint": "ik eet kaas"
        }
      ]
    }
  ]
}
 
  allAvailableFilter:string;
  onDeviceFilter: string;
  selectedFile: any;
  dummy = 0;
  pageNumber = 0 ;
  unsubscriber = new Subject();
  allFiles: string[];
  constructor(private _electron:ElectronService, private buttonService : MacrodeckButtonService) { }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  searchControl = new FormControl();
  fileControl = new FormControl();

  filteredOptionsPage: Observable<any>;
  filteredOptionsFile: Observable<any>;

  private _filterPageFile(value: string) {
    const filterValue = value.toLowerCase();
    return _.filter(this.pageFile.pages, (value) => value.name.toLowerCase().includes(filterValue))
  }

  private _filterFiles(array: string[], value: string) {
    const filterValue = value.toLowerCase();
    return _.filter(array, (value) => value.toLowerCase().includes(filterValue))
  }
  
  ngOnInit(): void {

    try{
      if(this._electron.fs.existsSync(`${__dirname}\\deckboard_getData\\finalData\\finalButton.json`)){
        const rawdata = this._electron.fs.readFileSync(`${__dirname}\\deckboard_getData\\finalData\\finalButton.json`)
        this.buttonFile = JSON.parse(rawdata.toString());
      }
      else{
        this._electron.fs.writeFileSync(`${__dirname}\\deckboard_getData\\finalData\\finalButton.json`, `{
          "command_id": 0,
          "type": "mock",
          "description": "Nothing found"
        },`)
      }
    }
    catch(error) {
      console.log(error);
    }

    this.buttonService.getAllFiles().pipe(takeUntil(this.unsubscriber)).subscribe((value) => {
      if(value){
        this.fileControl.setValue(value[0]);
        this.selectedFile = value[0];
        this.getFile(value[0]);
        this.filteredOptionsFile = this.fileControl.valueChanges.pipe(
          startWith(''),
          map(data => this._filterFiles(value, data)),
        );
      }
    })

    
  }

  submit(){
    this.buttonService.editFile({ pages: this.pageFile.pages, fileName: this.selectedFile}, 
      this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber)).subscribe(value =>{
        window.location.reload();
    },
    error => {
      console.log(error);
    })
  }

  setPage(pageName){
    console.log(pageName);
    this.selectedFile = _.find(this.pageFile.pages, (value) => value.name === pageName)
    this.pageNumber = _.findIndex(this.pageFile.pages, this.selectedFile);
  }

  getFile(fileName){
    this.buttonService.getFile(fileName, this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber)).subscribe(data => {
      this.pageFile = data;
      this.searchControl.setValue(this.pageFile.pages[0].name);
      this.filteredOptionsPage = this.searchControl.valueChanges.pipe(
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

  move(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  };

}

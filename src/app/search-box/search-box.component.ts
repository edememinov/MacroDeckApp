import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  @Output() textChanged = new EventEmitter<string>();
  searchBoxShown: boolean = false;
  filterText: string;

  constructor() {}

  ngOnInit(): void {}

  showSearchbox() {
    this.searchBoxShown = true;
  }

  onFilterClear() {
    this.filterText = '';
    this.searchBoxShown = false;
    this.textChanged.emit(this.filterText);
  }

  onTextChanged() {
    this.textChanged.emit(this.filterText);
  }
}
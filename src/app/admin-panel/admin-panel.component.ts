import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ElectronService } from '../core/services';
import { SafePipe } from '../services/safe.pipe';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(private _electron:ElectronService) { }
  data: SafeHtml;

  ngOnInit(): void {
    this.data = `http://${this._electron.ipcRenderer.sendSync('readUrl', '')}/home.html`;

    console.log(this.data);
  }

}

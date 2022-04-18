import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generic-snackbar',
  templateUrl: './generic-snackbar.component.html',
  styleUrls: ['./generic-snackbar.component.scss']
})
export class GenericSnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data, private snackRef: MatSnackBarRef<GenericSnackbarComponent>) { }

  ngOnInit(): void {
  }

}



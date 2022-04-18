import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackbarComponent } from '../shared/generic-snackbar/generic-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }
  
  showGenericSnackBar(message, isSuccessMessage){
    this.snackBar.openFromComponent(GenericSnackbarComponent, {
      data:{success: isSuccessMessage, textToShow: message},
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['white-snackbar']
    });
  }
}

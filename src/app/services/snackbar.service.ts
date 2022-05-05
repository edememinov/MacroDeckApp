import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackbarComponent } from '../shared/generic-snackbar/generic-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }
  
  showGenericSnackBar(message, isSuccessMessage, autoDisappear = true, duration = 5000){
    if(autoDisappear){
      this.snackBar.openFromComponent(GenericSnackbarComponent, {
        data:{success: isSuccessMessage, textToShow: message},
        verticalPosition: 'top',
        duration: duration,
        panelClass: ['white-snackbar']
      });
    }
    else{
      this.snackBar.openFromComponent(GenericSnackbarComponent, {
        data:{success: isSuccessMessage, textToShow: message},
        verticalPosition: 'top',
        panelClass: ['white-snackbar']
      });
    }
    
  }

  hideAllSnackbars(){
    this.snackBar.dismiss();
  }
}

import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private toastControl: ToastrService) { }

//hacer un solo toast

  private individualConfig: Partial<IndividualConfig> = {
    positionClass: 'toast-top-right',
    progressBar: true,
    closeButton: true,
    onActivateTick: true,
    enableHtml: true,
  };

  NotificarConToast(mensaje: string, tipo: string, titulo?: string) {
      this.toastControl.show(mensaje, titulo, this.individualConfig, tipo);
  }
}

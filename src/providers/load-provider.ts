import { Injectable } from "@angular/core";
import { Loading, LoadingController } from "ionic-angular";


@Injectable()
export class LoadProvider {

    private loader: Loading;

    constructor(
        private loadingCtrl: LoadingController) {
    }

    /**
     * Exiber mensagem para o usuário de loading
     *
     * @param {string} msg
     *
     */
    public abreCarregando(msg?: string): void {
        if (msg == undefined) {
            msg = "";
        }
        this.loader = this.loadingCtrl.create({
            spinner: 'crescent',
            content: msg
        });
        this.loader.present();
    }

    /**
     *  Fechar mensagem de loading
     *
     */
    public fechaCarregando(): void {
        this.loader.dismiss();
    }
}
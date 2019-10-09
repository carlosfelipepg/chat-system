import { Component, ViewChild } from '@angular/core';
import { NavController, Content, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageProvider } from '../../providers/image/image';
import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCkbJtsyGViP7JcPSLR2MwZlle-8JCs_O4',
  authDomain: 'chat-system-f12f3.firebaseapp.com',
  databaseURL: 'https://chat-system-f12f3.firebaseio.com',
  projectId: '62986765586',
  storageBucket: 'chat-system-f12f3.appspot.com',
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;

  public room: string = "";
  public msg: string = "";
  public showMessages: boolean = false;
  public messages: any;
  public userCode: string = "";
  public imageSend: any;

  firebaseRef = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    public imgProvider: ImageProvider,
    private alertCtrl: AlertController) {
  }

  getRoom = async () => {
    if (!this.room) {
      return;
    }
    this.userCode = this.makeid(6);
    this.messages = [];
    this.showMessages = true;

    await this.firebaseRef.database().ref('room/' + this.room).on('child_added', function (data) {
      this.messages.push({ key: data.key, message: data.val().message, userCode: data.val().userCode, image: data.val().image });
    }.bind(this));

    this.showMessages = true;
  }

  sendImage = () => {
    this.imgProvider.uploadImage(this.imageSend).then(data => {
      var newPostKey = this.firebaseRef.database().ref().child('room').push().key;

      var updates = {};
      updates['/room/' + this.room + '/' + newPostKey] = { message: '', userCode: this.userCode, image: data.downloadURL };

      this.firebaseRef.database().ref().update(updates);

      this.scrollToBottom();
    });
  }

  takePicture = () => {
    const options: CameraOptions = {
      quality: 30,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageSend = 'data:image/jpeg;base64,' + imageData;
      this.sendImage();
    }, (err) => {
      console.log(err)
      let alert = this.alertCtrl.create({
        title: 'Ocorreu um erro',
        subTitle: 'Ouve um problema ao enviar a imagem',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  submit = () => {
    if (!this.msg) {
      return;
    }
    var newPostKey = this.firebaseRef.database().ref().child('room').push().key;

    var updates = {};
    updates['/room/' + this.room + '/' + newPostKey] = { message: this.msg, userCode: this.userCode };

    this.firebaseRef.database().ref().update(updates);

    this.msg = "";
    this.scrollToBottom();
  }

  onFocus = () => {
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  makeid = (lt: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < lt; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}

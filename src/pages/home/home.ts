import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Content } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';
import { ImageProvider } from '../../providers/image/image';

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
  public imageSend;


  // firebaseRef = firebase.initializeApp(config);
  firebaseRef = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    public imgProvider: ImageProvider) {
  }
  ionViewDidLoad = () => {
    console.log('bumba')
    this.content.resize();
  }
  ionImgDidLoad() {
    console.log('did load')
  }

  ionError() {
    console.log('error load')
  }

  ionImgWillLoad() {
    console.log('will load')
  }

  getRoom = async () => {
    this.userCode = this.makeid(6);
    this.messages = [];
    this.showMessages = true;

    await this.firebaseRef.database().ref('room/' + this.room).on('child_added', function (data) {
      this.messages.push({ key: data.key, message: data.val().message, userCode: data.val().userCode, image: data.val().image });
    }.bind(this));
    this.showMessages = true;
    // await this.firebaseRef.database().ref('room/' + this.room).once('value', function (snapshot) {
    //   console.log(snapshot.val());
    //   console.log('um', this.messages)
    //   snapshot.forEach((data) => {
    //     this.messages.push({ key: data.key, message: data.val().message, userCode: data.val().userCode, image: data.val().image });
    //   });
    // }.bind(this));
    // console.log('dois', this.messages)
    // this.showMessages = true;
    // this.firebaseRef.database().ref('room/' + this.room).set({
    //   username: { cod: Math.random() * (40 - 1), message: this.msg }
    // // });    
    // var newPostKey = this.firebaseRef.database().ref().child('room').push().key;
    // console.log(newPostKey)
    // var updates = {};    
    // updates['/room/' + this.room + '/' + newPostKey] = { message: this.msg };

    // this.firebaseRef.database().ref().update(updates);

    // this.firebaseRef.database().ref('room/' + this.room).once('value').then(function (snapshot) {
    //   var username = (snapshot.val() && snapshot.val()) || 'Anonymous';
    //   console.log(typeof username)
    // });    
  }

  sendImage = () => {
    this.imgProvider.uploadImage(this.imageSend).then(data => {
      var newPostKey = this.firebaseRef.database().ref().child('room').push().key;

      var updates = {};
      updates['/room/' + this.room + '/' + newPostKey] = { message: '', userCode: this.userCode, image: data.downloadURL };

      this.firebaseRef.database().ref().update(updates);

      this.scrollToBottom();
      // if (data.state == 'success'){
      //   var dataP = { msg: msg, tp: 'i', sender: uIdA, img:data.downloadURL }
      //   this.afDB.object("/chats/" + uIdB + "/infoChats/" + uIdA).set({ emailSender: emailA, lastMSG: msg });
      //   this.afDB.object("/chats/" + uIdA + "/infoChats/" + uIdB).set({ emailSender: emailB, lastMSG: msg });
      //   this.afDB.list("/chats/" + uIdB + "/detail/" + uIdA).push(dataP);
      //   return this.afDB.list("/chats/" + uIdA + "/detail/" + uIdB).push(dataP);
      // }
    });
  }

  takePicture = () => {
    const options: CameraOptions = {
      quality: 30,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,//FILE_URI,//
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageSend = 'data:image/jpeg;base64,' + imageData;
      this.sendImage();
    }, (err) => {
      console.log(err)
    });
  }

  submit = () => {
    var newPostKey = this.firebaseRef.database().ref().child('room').push().key;

    var updates = {};
    updates['/room/' + this.room + '/' + newPostKey] = { message: this.msg, userCode: this.userCode };

    this.firebaseRef.database().ref().update(updates);

    this.msg = "";
    this.scrollToBottom();
    // this.firebaseRef.database().ref('room/' + this.room).once('value').then(function (snapshot) {
    //   var username = (snapshot.val() && snapshot.val()) || 'Anonymous';
    //   console.log(typeof username)
    // });    
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

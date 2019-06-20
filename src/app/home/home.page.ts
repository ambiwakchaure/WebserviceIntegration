import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { HTTP } from '@ionic-native/http/ngx';
import { finalize } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastController, Platform, LoadingController } from '@ionic/angular'; 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  id : any[];
  name : any[];
  constructor(
    private http : HttpClient,
    public toastController: ToastController,
    private nativeHttp : HTTP,
    private plt : Platform,
    private loadingController : LoadingController) {
    }

  fetchDataFromServer()
  {
    this.plt.is('cordova') ? this.getDataNative() : this.getDataStandard();
  }
  async getDataStandard()
  {
    //create progress bar 
    let loading = await this.loadingController.create();
    await loading.present();

    //make http call 
    this.http.get('http://192.168.0.11/ionic_demo/displayData.php').pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(
      data => 
      {
        //create json object from return object
        const myObjStr = JSON.stringify(data);
        this.presentToast(""+myObjStr);

        //parse received data
        this.parseJsonData(data)
      }, 
      err => 
      {
        console.log("Error occured");
      }
    )
  }
  async getDataNative()
  {
    //create progress bar 
    let loading = await this.loadingController.create();
    await loading.present();

    let nativeCall = this.nativeHttp.get('http://192.168.0.11/ionic_demo/displayData.php',{},{
      'Content-Type':'application/json'
    });
    from(nativeCall).pipe(

      finalize(() => loading.dismiss())
    )
    .subscribe(data => 
    {
      //create json object from return object
      const myObjStr = JSON.stringify(data);
      this.presentToast(""+myObjStr);
    }, 
    err => 
    {
      console.log("Error occured");
    })
  }
  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: ""+message,
      position:'top',
      duration: 2000,
    });
    toast.present();
  }

  //parse json data
  parseJsonData(data)
  {
    //return success flag
    let success = data.success;
    //return data json array
    //let dataArray = JSON.stringify(data.data);
    let dataArray = data.data;

    this.id = [];
    this.name = [];

    console.log("success : "+success);
    console.log("dataArray : "+dataArray);

    for(let i = 0; i < dataArray.length; i++)
    {
        let jsonObject = dataArray[i];
        this.id.push(jsonObject.id);
        this.name.push(jsonObject.name);
    }

    

  }

}

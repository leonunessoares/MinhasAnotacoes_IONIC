
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';

import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  databaseObj: SQLiteObject;
  database_name: string = "dbnote.db";
  table_name: string = "tabnote";
  name_model: string = "";
  row_data: any = [];
  dados= [];
  valor : string;

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

  
  constructor( public toastController: ToastController,
    private platform: Platform,
    private sqlite: SQLite) {
      this.platform.ready().then(() => {
        this.createDB();
        //this.name_model=Product.arguments(1);
        //this.pegaValorCampo();
       // this.getRows();
       
         
      }).catch(error => {
        console.log(error);      
      })    
      
    }
   
     // Create DB if not there
  /*createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        alert('Banco de dados criado!');
      })
      .catch(e => {
        alert("error banco " + JSON.stringify(e))
      });
  }*/

  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        //alert('Banco Criado!');
        this.createTable();
        //this.getRows();
      
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

 pegaTexto(texto:string){
    this.valor= texto;
    this.name_model=this.valor; 
    //alert(this.valor);
  }

  createTable() {
      try{
       
        this.databaseObj.executeSql(`
        CREATE TABLE IF NOT EXISTS ${this.table_name}  (pid INTEGER PRIMARY KEY, texto Text)
        `, [])
     
        //alert("tabela criada"); 
        //this.verificaRegistro();
        this.getRows();     
      }
      catch(error){
        alert("erro ao criar tabela" + error);
        //this.createDB();
      }
  } 

      
  //Inset row in the table
  insertRow() {
    this.deleteRow();
    // Value should not be empty
    if (!this.name_model.length) {
      this.exibeToast('Digite algo para salvar!') ;
      return; 
    }
    
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (texto) VALUES ('${this.name_model}')
    `, [])
      .then(() => {
        //alert('Row Inserted!');
        //this.getRows();
        this.exibeToast('Dados salvos com sucesso!'); 
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  pegaValorCampo(){
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_name}
    `
      , []).then((data) => {
        this.dados = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
               this.dados.push(data.rows.item(i));
               //alert(this.dados.push().item(i).texto);
            }
        }
    }, (e) => {

        console.log("Errot: " + JSON.stringify(e));
    });
}

  // Retrieve rows from table
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_name}
    `
      , [])
      .then((res:any) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          
          for (var i = 0; i < res.rows.length; i++) {
           //alert(this.row_data.push(res.rows.item(i)));
           this.row_data.push(res.rows.item(i));   
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))       
      });
      
  }

  

  // Delete single row 
  //WHERE pid = ${item.pid}
  deleteRow() {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.table_name} 
    `
      , [])
      .then((res) => {
        //alert("Row Deleted!");
        //this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Enable update mode and keep row data in a variable
  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;
    this.name_model = item.Name;
  }
/*WHERE pid = ${this.to_update_item.pid}*/
  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
      UPDATE ${this.table_name}
      SET texto = '${this.name_model}' 
      WHERE pid >= 0
       `, []) 
       
      .then(() => {
        alert('Row Updated!'); 
        //alert();
        this.updateActive = false;
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  async exibeToast(mensagem:string) {
    const toast = await this.toastController.create({
      message: mensagem,
      animated : true,
      translucent: true,
      duration: 2000
    });
    toast.present();
  }

    //vibrarCell(){
      // Vibrate the device for a second
      // Duration is ignored on iOS.
      //this.vibration.vibrate(1000);

      // Vibrate 2 seconds
      // Pause for 1 second
      // Vibrate for 2 seconds
      // Patterns work on Android and Windows only
      //this.vibration.vibrate([2000,1000,2000]);

      // Stop any current vibrations immediately
      // Works on Android and Windows only
      //this.vibration.vibrate(0);
    //}

}
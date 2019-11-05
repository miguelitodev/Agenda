import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  databaseObj: SQLiteObject;
	name_model: string = "";
	email_model: string = "";
	telefone_model: string = "";
	celular_model: string = "";
	row_data: any = [];
	readonly database_name: string = "Agenda.db";
	readonly table_name: string = "Componentes";

	constructor(
		private platform: Platform,
		private sqlite: SQLite
	) {
		this.platform.ready()
		.then(() => this.createDB())
		.then(()=> this.createTable())
		.catch(error => {
			console.log(error);
		})
	}

	// FUnção do botão criar agenda == create database
	async createDB() {
		return await this.sqlite.create({
			name: this.database_name,
			location: 'default'
		})
			.then((db: SQLiteObject) => {
				this.databaseObj = db;
				alert('Agenda criada!');
			})
			.catch(e => {
				alert("error agenda " + JSON.stringify(e))
			});
	}

	// Função do botão criar componentes == create table
	async createTable() {
		return await this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS "'+ this.table_name+'" (pid INTEGER PRIMARY KEY, Nome VARCHAR(255), Email VARCHAR(255), Telefone VARCHAR(255), Celular VARCHAR(255));', [])
			.then(() => {
				alert('Componentes criados!');
			})
			.catch(e => {
				alert("error componentes " + JSON.stringify(e))
			});
	}

	// FUnção do botão enviar
	insertRow() {

		if (((!this.name_model.length || !this.email_model.length) || !this.telefone_model.length) || !this.celular_model.length) {
			alert("Insira corretamente");
			return;
		}
		this.databaseObj.executeSql('INSERT INTO '+ this.table_name+' (Nome, Email, Telefone, Celular) VALUES("'+this.name_model+'", "'+this.email_model+'", "'+this.telefone_model+'", "'+this.celular_model+'");', [])
			.then(() => {
				alert('Adicionado com sucesso!');
				this.getRows();
			})

			.catch(e => {
				alert("error " + JSON.stringify(e))
			});

	}

	// Função do botão mostrar
	getRows() {
		this.databaseObj.executeSql("SELECT * FROM "+ this.table_name, [])
			.then((res) => {
				this.row_data = [];
				if (res.rows.length > 0) {
					for (var i = 0; i < res.rows.length; i++) {
						this.row_data.push(res.rows.item(i));
					}
				}
			})
			.catch(e => {
				alert("error " + JSON.stringify(e))
			});
	}

	// Função do botão deletar 
	deleteRow(item) {
		this.databaseObj.executeSql("DELETE FROM "+ this.table_name +" WHERE pid = " + item.pid, [])
			.then((res) => {
				alert("Row Deleted!");
				this.getRows();
			})
			.catch(e => {
				alert("error " + JSON.stringify(e))
			});
	}
}

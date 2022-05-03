import { Component, OnInit, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Equipment {  
    EquipmentID: String;  
    EquipmentName: String;
}

interface Material {
    MaterialID: String;
    MaterialName: String;
}

interface PurchaseOrders {
    PurchaseOrderID: String;
    Supplier: String;
    MaterialId: String;
    MaterialName: String;
    Quantity: String;
    TotalCost: String;
}

interface SalesOrders {
    SalesOrderID: String;
    DeliveryDate: String;
    Customer: String;
    MaterialId: String;
    MaterialName: String;
    Quantity: String;
    TotalValue: String;
  }

interface Workforce {
    WorkforceID: String;
    Name: String;
    Shift: String;
}


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  constructor(private http: HttpClient) {}

  qtdResultados = 0;
  equipments: Equipment[] = [];
  materials: Material[] = [];
  purchaseOrders: PurchaseOrders[] = []; 
  salesOrders: SalesOrders[] = [];
  workforce: Workforce[] = [];

  Mudarestado(el) {
    var display = document.getElementById(el).style.display;
    var textoBusca = (document.getElementById('search-input') as HTMLInputElement).value;

    if (display == 'none') {
      document.getElementById(el).style.display = 'block';
    }

    this.http
      .get<any>(`http://localhost:3000/?busca=${textoBusca}`)
      .subscribe((data) => {
        this.equipments = data.equipments as Equipment[];
        this.qtdResultados = this.equipments.length;

        this.materials = data.materials as Material[];
        this.qtdResultados += this.materials.length;

        this.purchaseOrders = data.purchaseOrders as PurchaseOrders[];
        this.qtdResultados += this.purchaseOrders.length;

        this.salesOrders = data.salesOrders as SalesOrders[];
        this.qtdResultados += this.salesOrders.length;

        this.workforce = data.workforce as Workforce[];
        this.qtdResultados += this.workforce.length;
      });
  }
}

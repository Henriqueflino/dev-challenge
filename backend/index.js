const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;


//Conexão mongoose
var mongoDB = 'mongodb://127.0.0.1:27017/multisearch';

mongoose.connect(mongoDB, {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	authSource: "admin",
	user:'root', 
	pass:'seed'
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro ao conectar ao MongoDB:'));

//Schemas
var Schema = mongoose.Schema;

var EquipmentsSchema = new Schema({
	EquipmentID: String,
	EquipmentName: String
});

var MaterialsSchema = new Schema({
	MaterialID: String,
	MaterialName: String
});

var PurchaseOrdersSchema = new Schema({
	PurchaseOrderID: String,
	DeliveryDate: String,
	Supplier: String,
	MaterialId: String,
	MaterialName: String,
	Quantity: String,
	TotalCost: String
});

var SalesOrdersSchema = new Schema({
	SalesOrderID: String,
	DeliveryDate: String,
	Customer: String,
	MaterialId: String,
	MaterialName: String,
	Quantity: String,
	TotalValue: String
});

var WorkforceSchema = new Schema({
	WorkforceID: String,
	Name: String,
	Shift: String
});


//Models
var Equipments = mongoose.model('equipments', EquipmentsSchema, 'equipments');
var Materials = mongoose.model('materials', MaterialsSchema,'materials');
var PurchaseOrders = mongoose.model('purchase_orders', PurchaseOrdersSchema,'purchase_orders');
var SalesOrders = mongoose.model('sales_orders', SalesOrdersSchema,'sales_orders');
var Workforce = mongoose.model('workforce', WorkforceSchema,'workforce');


var equipmentsQuery;
var materialsQuery;
var purchaseOrdersQuery;
var salesOrdersQuery;
var workforceQuery;


//Endpoint de busca
app.get('/', cors(), (request, response) => {
	var stringBusca = request.query.busca;

	console.log(`Pesquisando por ${stringBusca}`);

	configuraQueries(stringBusca);

	executaQueries().then(function (resultados){
		response.send(resultados)
	});
});

function configuraQueries(stringBusca) {
	var queryOptions = {$regex: stringBusca, $options: 'i'};

	equipmentsQuery = Equipments.find().or([
		{'EquipmentID': queryOptions}, 
		{'EquipmentName': queryOptions}
	]);
 
	materialsQuery = Materials.find().or([
		{'MaterialID': queryOptions}, 
		{'MaterialName': queryOptions}
	]);

	purchaseOrdersQuery = PurchaseOrders.find().or([
		{'PurchaseOrderID': queryOptions}, 
		{'DeliveryDate': queryOptions},
		{'Supplier': queryOptions},
		{'MaterialId': queryOptions},
		{'MaterialName': queryOptions},
		{'Quantity': queryOptions},
		{'TotalCost': queryOptions}
	]);

	salesOrdersQuery = SalesOrders.find().or([
		{'SalesOrderID': queryOptions}, 
		{'DeliveryDate': queryOptions},
		{'Customer': queryOptions},
		{'MaterialId': queryOptions},
		{'MaterialName': queryOptions},
		{'Quantity': queryOptions},
		{'TotalValue': queryOptions}
	]);

	workforceQuery = Workforce.find().or([
		{'WorkforceID': queryOptions}, 
		{'Name': queryOptions},
		{'Shift': queryOptions}
	]);

	//Configura colunas que vão retornar na query
	equipmentsQuery.select('EquipmentID EquipmentName');
	materialsQuery.select('MaterialID MaterialName');
	purchaseOrdersQuery.select('PurchaseOrderID DeliveryDate Supplier MaterialID MaterialName Quantity TotalCost');
	salesOrdersQuery.select('SalesOrderID DeliveryDate Customer MaterialID MaterialName Quantity TotalValue');
	workforceQuery.select('WorkforceID Name Shift');
}


async function executaQueries() {
	var resultados = {};

	resultados.equipments = await equipmentsQuery.exec();
	resultados.materials = await materialsQuery.exec();
	resultados.purchaseOrders = await purchaseOrdersQuery.exec();
	resultados.salesOrders = await salesOrdersQuery.exec();
	resultados.workforce = await workforceQuery.exec();

	return resultados;
}

app.listen(port, ()=>{
	console.log(`Escutando porta ${port}`);
});
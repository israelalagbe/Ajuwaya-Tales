import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ServiceService} from "./service.service";
import {ServiceMokeService} from "./serviceMoke.service";
import {Service} from "./service"
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/do';


@Component({
	templateUrl:`services.component.html`,
 providers:[
 	//	ServiceService
 	{provide:ServiceService,useClass:ServiceMokeService}
 ]
	//selector:"services"
})
export class ServicesComponent{
	services:Service[];
	showHome:boolean;
	clicked:number=0;
	inputValue:Service;
	constructor(private serviceService:ServiceService,private router:Router){
		/*this.services=["Web design",
		"Graphics deisgn",
		"Programming",
		"Rad"];*/
		//this.services=[serviceService.nextService(),serviceService.nextService(),serviceService.nextService()];
		this.showHome=false;
		this.inputValue=new Service("","")
		Observable.create();
		console.log("constructor called")
	}
	ngOnInit(){
		console.log("Service initialized")
		var subscription=this.serviceService.getServices()
		.do((data)=>{})//console.log(data))
		.subscribe((services)=>{
			//Notify or sucess
			this.services=services
		},
		(error)=>{
			console.log("Error occures")
		},
		()=>{
			subscription.unsubscribe();
		});
	}
	goHome(){
		this.router.navigate(["/home"]);
	}
	showMore(){
		this.showHome=true;
		this.clicked++;
		console.log("More is beibng shown")
	}
	addService(){
		console.log("Sericed being added")
		this.services.push(this.inputValue)

	}
}
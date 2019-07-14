/**
 * New typescript file
 */
import {Injectable} from '@angular/core'
import {Service} from './service'
import {Http,Response} from "@angular/http";
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ServiceService{
	private servicesUrl="app/services.json";
	constructor(private http:Http){

	}
  	nextService():Service{
  		return new Service("Web deelopment","We can develop websites");
  	}
  	getServices():Observable<Service[]>{
  		return this.http.get(this.servicesUrl)
		.map((response:Response)=><Service[]>response.json())
		.catch(this.handleError);
  	}
  	private handleError(error:Response){
  		console.error(error)
  		return Observable.throw(error.json().error());
  	}
}
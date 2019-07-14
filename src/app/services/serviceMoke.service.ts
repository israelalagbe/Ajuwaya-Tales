import {Injectable} from '@angular/core'
import {Service} from './service'
import {Observable} from 'rxjs/Rx'
import {Observer} from 'rxjs/Rx'
@Injectable()
export class ServiceMokeService{
	observer
	getServices():Observable<Service[]>{
		//var observable=Observable.of([new Service("Web design",'we do')])
		//Observable.
		var observable=Observable.create((observer:Observer<Service[]>)=>{
			var i=0;
			setInterval(()=>{
				observer.next([new Service(`Web design${i++}`,'We offer web design'),new Service('Graphics design','We offer graphics design')])
				observer.complete();
			},1000)
			observer.next([new Service('Web design','We offer web design'),new Service('Graphics design','We offer graphics design')])
			//observer.next([new Service('Web design','We offer web design')]);
		});
		return observable;
	}
}
import {Pipe,PipeTransform} from '@angular/core'

@Pipe({
	name:'ago'
})
export class AgoPipe implements PipeTransform {
	filter:Function
	constructor(){
		this.filter=this.ago();
	}
	
	transform(value):string {
		return this.filter(value);
	}
	ago(){
         var MILISEC = 1000;
         var SEC = MILISEC * 60;
         var MINUTE = SEC * 60;
         var HOUR = MINUTE * 24;
         return function (time) {
         	var date=new Date(time)
             var sec = (Date.now()) - date.getTime();
             if (sec < SEC)
                 var formated = Math.floor(sec / MILISEC) + " sec(s) ago";
             else if (sec < MINUTE)
                 var formated = Math.floor(sec / SEC) + " min(s) ago";
             else if (sec < HOUR)
                 var formated = Math.floor(sec / MINUTE) + " hour(s) ago";
             else
                 var formated = Math.floor(sec / HOUR) + " day(s) ago";
             //return formated;
             return formated;
     	 }
 	}
}
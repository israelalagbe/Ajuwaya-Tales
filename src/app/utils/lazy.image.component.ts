import {Component,Input,SimpleChanges,ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import {Observer} from 'rxjs/Rx'
@Component({
  selector: 'lazy-image',
  template:`
  	<img src='{{realSrc}}' [style]="styleNames|safe:'style'" class='{{classNames}}'  />
  `
})
export class LazyImageComponent {
	@Input() src:string
	@Input() dataSrc:string
	@Input('class') classNames:string
	@Input('style') styleNames:any
	realSrc:string
	constructor(private cd:ChangeDetectorRef){
		
	}
	ngOnChanges(changes: SimpleChanges) {
    	this.realSrc=this.src
		let image=new Image()
    	image.src=this.dataSrc;
    	image.onload=()=>{
    		
    		this.realSrc=image.src;
    		//console.log("Loaded lazy image",this.realSrc)
    		this.cd.markForCheck()
    	}
    }

	ngOnInit(){
		
	}
	
}

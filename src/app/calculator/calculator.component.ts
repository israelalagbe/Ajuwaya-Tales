import {Component,Input,Output} from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
enum Sign{
	add,
	sub,
	mul,
	div
}
@Component({
	template:`
<div>
<h1>{{title}}</h1>
	<input type="number" name="" (keyup)="calculate()" [(ngModel)]="num1">
	<select [(ngModel)]="sign" (change)="calculate()">
		<option value='0'>+</option>
		<option value='1'>-</option>
		<option value='2'>*</option>
		<option value='3'>/</option>
	</select>
	<input type="number" (keyup)="calculate()" name="" [(ngModel)]="num2">
	<span>{{calculate()|num2text:' Naira'}}</span>
</div>
	`,
	selector:"calculator"
})
export class CalculatorComponent{
	title="Calculator"
	num1=0
	num2=0
	result=0
	sign:Sign=Sign.add
	constructor(){
		console.log(AngularFireAuth)
	}
	ngOnInit(){
		console.log("Initialized calc")
	}
	ngOnChanges() {
		console.log("Changes happend")
	}
	calculate(){
		switch (Number(this.sign)) {
			case Sign.add:
				this.result=this.num1+this.num2
				break;
			case Sign.sub:
				this.result=this.num1-this.num2
				break;
			case Sign.mul:
				this.result=this.num1*this.num2
				break;
			case Sign.div:
				this.result=this.num1/this.num2
				break;
			default:
				console.log('"'+this.sign+'"')
				break;
		}
		return this.result;
	}
}
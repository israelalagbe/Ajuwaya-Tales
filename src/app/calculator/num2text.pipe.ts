import {Pipe,PipeTransform} from '@angular/core'

@Pipe({
	name:'num2text'
})
export class Number2TextPipe implements PipeTransform {
	one2twenty=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','forteen','fifteen','sixteen','seventeen','eighteen','nineteen']
	twenty2Nighty=['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
	constructor(){

	}
	
	transform(value,suffix):string {
		var text=""
		value=Number(value);
		text+=this.convert(value,value)
		if (suffix) {
			text+=suffix
		}
		return text;

	}
	convert(num,initialValue){
		if (num<20) { //Units
			num=Math.floor(num);
			if (num<0)
				return `Minus ${this.convert(-num,-num)}`;
			else if(num==0 && initialValue>9)
				return "";
			else
				return `${this.one2twenty[num]}`;
		}
		else if (num<100) {//Tens
			var index=Math.floor(num/10)-2;
			var tensText=this.twenty2Nighty[index]
			var unitText=this.convert(num%10,num);
			return `${tensText} ${unitText}`
		}
		else if (num<1000) {//Hundreds
			var hundredText=this.convert(Math.floor(num/100),num)
			var otherText=this.convert(num%100,num);
			return `${hundredText} hundred ${num%100==0?'':'and'} ${otherText}`
		}
		else if (num<1000000) {//Thousnads
			var thousandText=this.convert(Math.floor(num/1000),num)
			var otherText=this.convert(num%1000,num);
			return `${thousandText} thousand ${otherText}`
		}
		else if (num<1000000000) {//Millions
			var millionText=this.convert(Math.floor(num/1000000),num)
			var otherText=this.convert(num%1000000,num);
			return `${millionText} million ${otherText}`
		}
	}
}
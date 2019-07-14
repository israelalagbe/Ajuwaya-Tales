export class Base64Helper{
	static async readBase64(file:File):Promise<string>{
		return new Promise<string>((resolve,reject)=>{
			var reader=new FileReader();
			reader.onload=()=>{
				resolve(<string>reader.result);
			}
			reader.onerror=(e)=>{
				reject(reader.error);
			}
			reader.readAsDataURL(file)
		});
	}
	static async readFilesBase64(files:File[]){
		let results:string[]=[]
		for(let file of files){
			results.push(await Base64Helper.readBase64(file));
		}
		return results;
		// return await files.map(async (file)=>{
		// 	return 
		// })
	}
}
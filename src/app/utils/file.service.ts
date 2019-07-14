import { Injectable } from '@angular/core'
import { Http,Headers,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {
	private baseUrl="http://oyolautechalumni.org/";
	constructor(private http:Http){

	}
	 uploadImage(file:File){
		return this.upload(`${this.baseUrl}imagecdn/index.php`,file)
	}
	 uploadProfileImage(user_id:string,file:File){
		return this.upload(`imagecdn/uploadProfile.php?user_id=${user_id}`,file)
	}
	upload(path,file:File):Promise<{path:string,thumb_path:string}>{
        const body = file;

        //const headers = {'Content-Type': 'image/jpg'};
        return this.http.post(path, body, {})
            .map((response:Response) => {
               console.log("Response",response);
               let res=response.json();
               return {
               	path:`${this.baseUrl}${res.path}`,
               	thumb_path:`${this.baseUrl}${res.path}`
               };
            })
            .toPromise();
    }
}

import {Observable,Observer} from 'rxjs/Rx'
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, AngularFireList, QueryFn } from 'angularfire2/database';
import * as firebase from 'firebase/app';

export class Upload{
	progress:number=1;
	constructor(public file:File){}
}
export class BaseService{
    rootBase = 'rootBase/';
    static inMemoryStorage={}
    static freshSet={}
    constructor(public db: AngularFireDatabase,public firebaseApp: FirebaseApp){
    }
    mapActions<T>(list: AngularFireList<T>,desc=true): Observable<T[]> {
		return list.snapshotChanges()
			.map((actions) => {
				let values: T[] = [];
				actions.map(action => {
					let value = action.payload.val();
					if(value)
						value.id = action.key;
					values.push(value)
				})
				return values;
			});
    }
    objectToArray<T>(obj:any):T[]{
        let keys=Object.keys(obj)
        return keys.map((key)=>{
            let item=obj[key];
            item.id=key;
            return item;
        });
    }
    async addNode<T>(path:string,field:T){
		let list=this.db.list(`${this.rootBase}${path}`);
		var ref=list.push(field);
		let key=ref.key;
		await ref;
		return key;
	}
	removeNode(path:string[]){
		let id=path.pop()
		let list=this.db.list(`${this.rootBase}${path.join('/')}`);
		return list.remove(id)
	}
	async updateNode<T>(path:string[],field:T){
		let id=path.pop()
		let list=this.db.list(`${this.rootBase}${path.join('/')}`);
		list.remove(id)
		console.log(`${this.rootBase}${path.join('/')}`,id)
		return list.update(id,field);
	}
    getNode<T>(...path):Observable<T>{
		return this.db.object<T>(`${this.rootBase}/${path.join('/')}`)
			.snapshotChanges()
			.map((action)=>{
				let value = action.payload.val();
				if(value)
					value.id = action.key;
				return value;
			});
	}
    getNodes<T>(path: string) {
		const list= this.db.list<T>(`${this.rootBase}${path}`);
		return this.mapActions(list);
	}
	getNodesPage<T>(path:string,limit,afterId?,desc=true){
		const list=this.db.list<T>(`${this.rootBase}${path}`,(ref)=>{
			let q=ref.orderByKey();
			if(desc)
				q=q.limitToLast(limit+1);
			else
				q=q.limitToFirst(limit+1);
			if (afterId) {
				if(desc)
					return q.endAt(afterId)
				else
					return q.startAt(afterId)
			}
			return q;
		})
		return this.mapActions(list);
	}
	public uploadFile(path:string,filename:string,upload:Upload):Promise<{url:string,name:string}>{
		let storageRef = this.firebaseApp.storage().ref();
		upload.progress=1;
		//var filename=`${(new Date).getTime()}-${upload.file.name}`;
		let uploadTask = storageRef.child(`${path}/${filename}`).put(upload.file);
		let deffered={
			reject:null,
			resolve:null,
			promise:null
		}
		deffered.promise=new Promise((resolve,reject)=>{
				deffered.reject=reject
				deffered.resolve=resolve
			});
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      		(snapshot:any) =>  {
        	// upload in progress
        		upload.progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      		},
      		(error) => {
        		deffered.reject(error)
      		},
      		() => {
        	// upload success
        	var result:{url:string,name:string}={
        			url:uploadTask.snapshot.downloadURL,
        			name:filename
        		};
        		deffered.resolve(result)
      		}
    	);
    	return deffered.promise;
	}
	isFreshSet(key){
		if(BaseService.freshSet[key])
			return true;
		else
			return false;
	}
	getLocalStorage<T>(key:string):T{
        try{
        	if(!BaseService.inMemoryStorage[key])
        		BaseService.inMemoryStorage[key]=JSON.parse(localStorage.getItem(key));
            //console.log("JSON parse",JSON.parse(localStorage.getItem(key)))           
            return <T><any>BaseService.inMemoryStorage[key];
        }catch(e){
            console.log("Error occured from localstorage",e)
            return <T><any>null;
        }
    }
    setLocalStorage(key:string,value){
    	BaseService.inMemoryStorage[key]=value;
    	BaseService.freshSet[key]=value;
        localStorage.setItem(key,JSON.stringify(value));
    }
    
}
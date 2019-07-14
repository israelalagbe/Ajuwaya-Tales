import { Injectable } from '@angular/core'
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable,Observer } from 'rxjs/Rx'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList, QueryFn } from 'angularfire2/database';
import {BaseService} from '../utils/base.service'
import { FirebaseApp } from 'angularfire2';
import {User} from './user'
import { Http,Headers,Response } from '@angular/http';
import {UserRecord,Summary,Follower,Following} from './user.records'
export class Admin {
	public constructor(public email: string, public password: string) { }
}
@Injectable()
export class AuthService extends BaseService {
	user: Observable<firebase.User>
	userDetails: firebase.User;
	userData:User;
	loggedIN: boolean = false;
	credentials: Admin;
	authenticatedObserver:Observer<boolean>
	authenticated:boolean=false
	setCurrentUser(user:User){
		this.userData=user;
		this.setLocalStorage('user',user)
		if(user)
			this.setLocalStorage(`users/${user.id}`,user)
		//localStorage.setItem('user',JSON.stringify(user))
	}
	getCurrentUser():User{
		let data=this.userData;
		if(data)
			return data;
		else
			return this.getLocalStorage<User>('user');//JSON.parse(localStorage.getItem('user'));
	}
	getCurrentUserRecords(){
		return this.getUserRecords(this.getCurrentUser().id);
	}
	constructor(private _firebaseAuth: AngularFireAuth, private router: Router, db: AngularFireDatabase,firebaseApp:FirebaseApp,private http:Http) {
		super(db,firebaseApp)
		this.user = _firebaseAuth.authState;
		this.getAuthenticated()
		this.user.subscribe(
			async (user) => {
				if (user) {

					// this.getUsers().subscribe((users)=>{
					// 	console.log("users",users)
					// })

					console.log("You are already logged in",user)
					try{
						if(!this.getCurrentUser())
							this.setCurrentUser(await this.getUser(user.uid));
						this.userDetails = user;
					//this.setAuth(true)
					}
					catch(e){
						console.error(e)
						//await this.updateNode<User>(`users/`,user.uid,<any>user.providerData[0]);
						this.setCurrentUser(<any>user.providerData[0]);


					}
					finally{
						console.log("Current user",this.getCurrentUser())
						this.userDetails = user;
						if(document.location.hash.substr(1)=="/auth"){
							this.router.navigate(['pages/feeds'])
						}
						//alert(this.router.url)
					}
					
					
					//console.log("Token", await this.getToken())
					
					//this.userDetails = user;
					/*if (this.credentials) {
						this.getAdmin().then((admins)=>{
						this.loggedIN=false;
						console.log(admins)
						admins.forEach((admin)=>{
							if (admin.username==this.credentials.username && admin.password==this.credentials.password) {
								this.loggedIN=true
								this.router.navigate(['/pages/users'])
							}
						})
						return this.loggedIN?Promise.resolve(this.loggedIN):Promise.reject(this.loggedIN);
					},(err)=>{
						console.error(err)
						alert("Login Failed, Please check your login details")
					})
					}
					else
						this.logout();
				   */

				}
				else {
					//this.setAuth(false)
					this.router.navigate(['/auth'])
					this.setCurrentUser(null)
					//this.userDetails = null;
					console.log("not logged in")
				}
			}
		);
	}
	setAuth(val:boolean){
		this.authenticated=val
		this.authenticatedObserver.next(this.authenticated)
		//this._firebaseAuth.auth.createUserWithEmailAndPassword()
	}
	async loginWithEmail(email, password) {

		let userDetails=await this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
		let user=await this.getNode<User>([`users`,userDetails.uid]).toPromise()
		this.setCurrentUser(user)
			//this.setAuth(true)
		this.router.navigate(['pages/feeds'])
		return user;

		/*this.credentials=new Admin(email,password)*/
		//return this.loginWithGoogle()
	}
	getAuthenticated(){
		return Observable.create((observer:Observer<boolean>)=>{
			this.authenticatedObserver=observer;
			observer.next(this.authenticated)
			window['you']=()=>{
				this.authenticated=this.authenticated?false:true;
				this.authenticatedObserver.next(this.authenticated);
			};
		})
		
	}
	getAdmin() {
		return this.db.list<Admin>(`rootBase/admin`).valueChanges();
	}
	async register(user:User){
		let userDetails=await this._firebaseAuth.auth.createUserWithEmailAndPassword(user.email,user.password)
		let u={...user};
		delete u.password;
		await this.updateNode([`users`,userDetails.uid],u);
		this.setCurrentUser(u)
		this.router.navigate(['pages/feeds'])
		return u;
	}
	loginWithGoogle() {
		console.log("Loging in with google")
		return this._firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
	}
	isLoggedIn() {
		return this.getCurrentUser();
	}
	getToken(): Promise<string> {
		if (!this.userDetails) {
			return Promise.reject("Not currently loggedin");
		}
		return this.userDetails.getToken();
	}
	logout() {
		console.log("Logginlg out user")
		//this.setAuth(false)
		this._firebaseAuth.auth.signOut()
			.then(() => {
				this.userDetails=null;
				this.setCurrentUser(null)
				this.loggedIN = false;
				this.router.navigate(['/auth'])
			});
	}
    getUserRecords(user_id:string):Observable<UserRecord>{
		return Observable.create((observer:Observer<UserRecord>)=>{
			let userRecord=this.getLocalStorage<UserRecord>(`user_records/${user_id}`);
			if(userRecord){
				observer.next(userRecord)
			}
			if(!this.isFreshSet(`user_records/${user_id}`)){
				this.loadOnlineUserRecords(user_id).subscribe((userRecord)=>{
					console.log("Online user record",userRecord)
					observer.next(this.checkUserRecord(userRecord))
					this.setLocalStorage(`user_records/${user_id}`,userRecord);
				},(err)=>{
					observer.error(err)
				})
			}
		});
	}
	resetOfflineRecordToOnline(user_id:string){
		return this.loadOnlineUserRecords(user_id).do((userRecord)=>{
			this.setLocalStorage(`user_records/${user_id}`,userRecord);
		})
	}
	updateUserRecords(user_id:string,data:UserRecord){
		let record:any=JSON.parse(JSON.stringify(data));
		record.summary={}
		record.summary[user_id]=data.summary;
		
		return this.updateNode(['user_records',user_id],record);
	}
	async addToUserRecordSummary(user_id:string,field:string,value:number){
		let record=await this.getUserRecords(user_id).first().toPromise()
		if(!record.summary){
			record.summary=new Summary()
		}
		record.summary[field]+=value;
		await this.updateUserRecords(user_id,record)
		return record;
	}
	checkUserRecord(record:UserRecord){
		if(!record){
			record=new UserRecord()
			record.summary=new Summary()
			record.followers=<any>{}
			record.followers=<any>{}
		}

		if(!record.followers)
			record.followers=<any>{}
		if(!record.following)
			record.following=<any>{}
		return record;
	}
	canFollow(user_id:string){
		if(this.getCurrentUser().id==user_id)
			return false;
		
		let canfollow=true
		let records=this.getLocalStorage<UserRecord>(`user_records/${this.getCurrentUser().id}`);
		if(!records||!records.following)
			return canfollow;
		this.objectToArray<Following>(records.following).forEach((following)=>{
			if(following.following==user_id){
				canfollow=false
				//console.log("Found",user_id,"in following")
			}
		})
		return canfollow;
	}
	async followUser(user_id:string){
		let currentUser=this.getCurrentUser()
		let targetUserRecord=await this.getUserRecords(user_id).first().toPromise()
		let currentUserRecord=await this.getCurrentUserRecords().first().toPromise()
		targetUserRecord=this.checkUserRecord(targetUserRecord)
		currentUserRecord=this.checkUserRecord(currentUserRecord)
		let promises=[]
		//Update the in the node of the person you followed
		promises.push(this.updateNode(['user_records',user_id,'followers',currentUser.id],new Follower(user_id,currentUser.id)));
		let summary=targetUserRecord.summary;
		summary.total_followers+=1
		promises.push(this.updateNode(['user_records',user_id,'summary',user_id],summary));
		//await this.updateNode('user_records',user_id,new Follower(user_id,currentUser.id));
		//Update the people you are following in your own node
		promises.push(this.updateNode(['user_records',currentUser.id,'followings',user_id],new Following(user_id,currentUser.id)));
		summary=currentUserRecord.summary;
		summary.total_followings+=1
		promises.push(this.updateNode(['user_records',currentUser.id,'summary',currentUser.id],summary));//',currentUser.id,new Following(user_id,currentUser.id)));
		await Promise.all(promises)
		await this.resetOfflineRecordToOnline(currentUser.id).toPromise()
		await this.resetOfflineRecordToOnline(user_id).toPromise()
		


		/*
		//console.log("current",currentUserRecord,"target",targetUserRecord)
		currentUserRecord.following[user_id]=(new Following(user_id,currentUser.id))
		targetUserRecord.followers[user_id]=(new Follower(currentUser.id,user_id))
		//current user followings
		await this.updateUserRecords(user_id,targetUserRecord)
		this.addToUserRecordSummary(user_id,'total_followers',1)
		//current user followers
		await this.updateUserRecords(currentUser.id,currentUserRecord)
		this.addToUserRecordSummary(currentUser.id,'total_followings',1)*/
	}
	async unFollowUser(user_id:string){
		let currentUser=this.getCurrentUser()
		let targetUserRecord=await this.getUserRecords(user_id).first().toPromise()
		let currentUserRecord=await this.getCurrentUserRecords().first().toPromise()
		targetUserRecord=this.checkUserRecord(targetUserRecord)
		currentUserRecord=this.checkUserRecord(currentUserRecord)
		let promises=[]
		//Update the in the node of the person you followed
		promises.push(this.removeNode(['user_records',user_id,'followers',currentUser.id]));
		let summary=targetUserRecord.summary;
		if(summary.total_followers>0) summary.total_followers-=1
		promises.push(this.updateNode(['user_records',user_id,'summary',user_id],summary));
		//await this.updateNode('user_records',user_id,new Follower(user_id,currentUser.id));
		//Update the people you are following in your own node
		promises.push(this.removeNode(['user_records',currentUser.id,'followings',user_id]));
		summary=currentUserRecord.summary;
		if(summary.total_followings>0) summary.total_followings-=1
		promises.push(this.updateNode(['user_records',currentUser.id,'summary',currentUser.id],summary));//',currentUser.id,new Following(user_id,currentUser.id)));
		await Promise.all(promises)
		await this.resetOfflineRecordToOnline(currentUser.id).toPromise()
		await this.resetOfflineRecordToOnline(user_id).toPromise()
		
	}
	loadOnlineUserRecords(user_id:string){
		return this.getNode<any>('user_records',user_id).first().switchMap((record)=>{
			if(!record)
				return Observable.of(null);
			let userRecord=new UserRecord()
			userRecord.summary=record.summary[user_id]
			userRecord.followers=record.followers
			userRecord.following=record.followings
			return Observable.of( userRecord)
		});
	}
	getFollowers(user_id:string):Observable<Follower[]>{
		return this.getUserRecords(user_id).map((records)=>{
			console.log("Followers",records.followers)
			if(!records.followers)
				return null;
			return this.objectToArray<Follower>(records.followers).map((item)=>{
				item.user=this.getUserObservable(item.owner_id)
				return item;
			}).filter((item)=>{
				return item.owner_id!=user_id;
			});
		})
		
	}
	getFollowing(user_id:string):Observable<Following[]>{
		return this.getUserRecords(user_id).map((records)=>{
			console.log("Following",records.following)
			if(!records.following)
				return null;
			return this.objectToArray<Following>(records.following).map((item)=>{
				item.user=this.getUserObservable(item.following)
				return item;
			}).filter((item)=>{
				return item.following!=user_id;
			});
		})
		
	}
	getUser(id:string){
		let user=this.getLocalStorage<User>(`users/${id}`);
			if(user)
				return Promise.resolve(user);
		return this.getNode<User>('users',id)
					.first()
					.do((user)=>{
						this.setLocalStorage(`users/${id}`,user)
					})
					.toPromise()
	}
	getUserObservable(id:string):Observable<User>{
		return Observable.create((observer:Observer<User>)=>{
			let user=this.getLocalStorage<User>(`users/${id}`);
			if(user)
				observer.next(user);
			if(!this.isFreshSet(`user_records/${id}`)){
				this.getNode<User>('users',id)
					.first()
					.subscribe((user)=>{
						observer.next(user)
						this.setLocalStorage(`users/${id}`,user)
					},(err)=>{
						observer.error(err)
					})
			}
		});
		
	}
	getUsers(limit=10){
		return this.getNodesPage<User>('users',limit,undefined,true)
	}
	getWhotoFollow(){
		let observable:Observable<User[]>;
		let users=this.getLocalStorage<User[]>(`users`);
		if(users)
			observable=Observable.of(users)
		else{
			observable=this.getUsers(4).map((users)=>{
				/*users=users.filter((user)=>{
					return this.getCurrentUser().id!=user.id
				})*/
				this.setLocalStorage(`users`,users)
				return users;
			});
		}
		return observable.map((users)=>{
			return users.filter((user)=>{
				console.log(this.getCurrentUser().id!=user.id)
				return this.getCurrentUser().id!=user.id
			})
		});
		
	}
}


@Injectable()
export class AuthServiceMoke {
	public loggedIn = false
	authenticatedObserver:Observer<boolean>
	authenticated:boolean=false
	constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {

	}
	loginWithGoogle() {
		this.router.navigate(['/pages/users'])
		this.loggedIn = true;
		return Promise.resolve(true)
	}
	loginWithEmail(email, password) {
		this.router.navigate(['/feeds'])
		this.loggedIn = true;
		return Promise.resolve(true)
	}
	isLoggedIn() {
		return this.loggedIn
	}
	setAuth(val:boolean){
		this.authenticated=val
		this.authenticatedObserver.next(this.authenticated)
	}
	logout() {
		this.loggedIn = false
		this.setAuth(false)
		this.router.navigate(['/auth'])
	}
}
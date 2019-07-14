import {BaseService} from '../utils/base.service'
import { Injectable } from '@angular/core';
import {Observable,Observer} from 'rxjs/Rx'
import {Comment} from './comment';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, AngularFireList, QueryFn } from 'angularfire2/database';
import {User} from '../auth/user'
import { Http } from '@angular/http';

@Injectable()
export class CommentService extends BaseService{
	commentPath='comments/'
	userPath='users/'
	baseUrl='https://us-central1-edible-5b9bf.cloudfunctions.net/'
	constructor(firebaseApp:FirebaseApp,/*firebaseAuth:AngularFireAuth,*/db: AngularFireDatabase,private http:Http){
		super(db,firebaseApp);
	}	
	// getComment(commentId:string){
	// 	return this.db.object<Comment>(`${this.commentPath}${commentId}`)
	// 	.valueChanges()
	// 	.map((comment)=>{
	// 		this.getUser(comment.user_id).subscribe((user)=>{
	// 					comment.user=user;
	// 		});
	// 		if (comment.type=='personality') {
	// 			this.personalityService.getPersonality(comment.item_id).subscribe((item)=>{
	// 				comment.item=item;
	// 			})
	// 		}
	// 		else if(comment.type=='media') {
	// 			this.personalityService.getMediaById(comment.item_id,comment.personalityId).subscribe((item)=>{
	// 				comment.item=item;
	// 			})
	// 		}
	// 		//this.userService.getUser(comment.user_id).subscribe((user)=>{
	// 		//	comment.user=user;
	// 		//})
	// 		//this.getMusic(comment.music_id).subscribe((music)=>{
	// 		//	comment.music=music;
	// 		//})
	// 		console.log(comment)
	// 		return comment;
	// 	})
	// }
	async addComment(comment:Comment){
	 	let key=await this.addNode(`${this.commentPath}${comment.feed_id}`,comment);
	 	this.http.get(`${this.baseUrl}updateComments?id=${comment.feed_id}`,{}).toPromise();
	 	return  key;
	}
	getComments(feedId:string,limit:number,afterId?:string,personalityID?:string):Observable<Comment[]>{
		//let commentsList= Observable.of([new Comment("1","1","personality","The information about this personality is wong"),new Comment("1","1","personality","this is great")]);
		let commentsList=this.getNodesPage<Comment>(`${this.commentPath}/${feedId}/`,limit,afterId,false);
		return commentsList
		.map((comments,index)=>{
				comments.map((comment)=>{
					comment.userObservable=this.getUser(comment.user_id);
				})
			return comments;
		});
	}
	getUser(ID):Observable<User>{
		/*let user=new User("Israel","israelalagbe53@gmail.com")
		user.ID="1"
		return Observable.of(user);*/
		return this.getNode(this.userPath,ID);
		//return this.db.object<User>(`${this.userPath}${ID}`).valueChanges();
	}
}
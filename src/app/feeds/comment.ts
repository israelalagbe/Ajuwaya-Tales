import {User} from '../auth/user'
import {Observable} from 'rxjs/Rx'
export class Comment{
	public comment_status:'Active'|'Disabled'='Active';
	date_posted:string=(new Date).toJSON();
	userObservable?:Observable<User>
	constructor(public feed_comment:string,public feed_id:string, public user_id:string){
	}
}
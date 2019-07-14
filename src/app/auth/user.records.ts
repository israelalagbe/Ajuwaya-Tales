import { Observable } from 'rxjs/Observable'
import {User} from './user'
export class Summary{
	Updated_At:string=(new Date).toJSON()
	total_comments:number=0
	total_feeds:number=0
	total_followers:number=0
	total_followings:number=0
}
export class Follower{
	Updated_At:string=(new Date).toJSON()
	date:string=(new Date).toJSON()
	//uid:string //Your id
	//owner_id:string //The person following you
	user:Observable<User>
	/**
	 *@param {string} uid Your ID
	 *@param {string} owner_id  The person following you
	 */
	constructor(public uid:string,public owner_id:string){}
}
export class Following{
	canFollow=true
	Updated_At:string=(new Date).toJSON()
	date:string=(new Date).toJSON()
	//following:string //the person you are following
	//owner_id:string //Your ID
	user:Observable<User>
	/**
	*@param {string} following The person you are following
	* @param {string} owner_id Your ID
	*/
	constructor(public following:string,public owner_id:string){}
}
export class UserRecord{
	summary:Summary
	followers:{[id:string]:Follower}
	following:{[id:string]:Following}
}

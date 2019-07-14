import { Component, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '../auth/auth.service'
import {User} from '../auth/user'
import {Observable} from 'rxjs/Observable'
import {FeedService} from '../feeds/feeds.service'
import {Feed} from '../feeds/feed';
import { Router } from '@angular/router';
@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
	/*loading=false
	userRecords:any
	feedsObservable:Observable<Feed[]>
	feeds:Feed[]
	limit = 10;
	prevId: String;
	nextId: String;
	currentPageId: string;
	previousPages: string[]=[];
	constructor(private router: Router,private authService:AuthService,private feedService:FeedService){
	}
	ngOnInit(){
		window.scrollTo(0, 0); 
		const user_id=this.user.id;
		this.showFeeds()
		this.userRecords=this.authService.getUserRecords(user_id).do((user)=>{
			console.log("User record",user)
		});;

	}
	showFeedDetails(feed:Feed){
    	console.log("navigating")
    	this.router.navigate(['pages','feeds', feed.id])
    }
    gotoFollowers(){
    	const user_id=this.user.id;
    	this.router.navigate(['pages','profile', user_id,'followers'])
    	//pages/profile/Hkn2DuFsrMhn8b10ZvZFyGI2Ptk1/followers
    }
    gotoFollowings(){
    	const user_id=this.user.id;
    	this.router.navigate(['pages','profile', user_id,'followings'])
    	//pages/profile/Hkn2DuFsrMhn8b10ZvZFyGI2Ptk1/followers
    }
	showFeeds(){
		const user_id=this.user.id;
		this.feedsObservable=this.feedService.getFeedsByUser(user_id,this.limit)
			.switchMap((feeds,index)=>{
				feeds=feeds.reverse()
				console.log(feeds)
				this.feeds=feeds.slice(0,this.limit)
				this.nextId=feeds[this.limit]?feeds[this.limit].id:this.nextId;
			//setTimeout(()=>{
			//	this.ref.detectChanges()
			//},100)

			console.log("Next",this.nextId)
				return Observable.of(this.feeds);
			});
	}
	
	get user(){
		return this.authService.getCurrentUser()
	}
	*/
	
}

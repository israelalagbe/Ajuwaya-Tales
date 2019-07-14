import {Component} from "@angular/core";
import {FeedService} from '../feeds.service';
import {Feed} from '../feed';
import {Comment} from '../comment';
import {Observable} from 'rxjs/Rx';
import  {ActivatedRoute} from '@angular/router'
import { Router } from '@angular/router';
import {CommentService} from '../comment.service'
import {AuthService } from '../../auth/auth.service'
@Component({
    templateUrl:'./feed.details.component.html'
})
export class FeedDetailsComponent{
	feedObservable:Observable<Feed>
	feeda:Feed
	feedId:string
    commentText:string
    commentsObservable:Observable<Comment[]>
    commentLimit=100
    currentUser:any
    addingComment=false
	constructor(private route:ActivatedRoute,public feedService:FeedService,private router: Router,private commentService:CommentService,private authService:AuthService){
	this.route.params.subscribe((res)=>{
       this.feedId=res.id;
     })
    }
  formatFeedText(text){
    /*const maxLen=100
    if(text&&text.length>maxLen){
      text=text.substr(0,maxLen)+"........";
    }*/
    return text;
  }
    ngOnInit(){
        window.scrollTo(0, 0);
        this.currentUser=this.authService.getCurrentUser()
        this.feedService.updateViews(this.feedId).catch(()=>{});
    	this.feedObservable=this.feedService.getFeed(this.feedId).do((feed)=>{
    		this.feeda=feed;
            if(!this.feeda)
                this.router.navigate(['error'])
    	});
        this.commentsObservable=this.commentService.getComments(this.feedId,this.commentLimit)
    }

   async likeFeed(feed:Feed){
    try{
      feed.likes+=1
        await this.feedService.updateLike(feed)
    }
    catch(e){
      feed.likes-=1
      alert("Network connection failed")
    }
   }

    gotoUserProfile(user_id:string){
        this.router.navigate(['pages','profile',user_id])
    }
    async addComment(e){
        e.preventDefault()
        try{
            this.addingComment=true
            let comment=new Comment(this.commentText,this.feedId,this.currentUser.id)
            await this.commentService.addComment(comment);
        this.commentText=""
    }catch(e){
        console.error(e)
        alert("Error occured while adding comment, please ensure that your internet connection is turned on.")
    }
    this.addingComment=false;
    }
}
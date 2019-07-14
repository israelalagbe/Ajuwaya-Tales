import {Component,SimpleChanges,ViewChild,ElementRef} from "@angular/core";
import {FeedService} from './feeds.service';
import {Feed} from './feed';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {FileService} from '../utils/file.service'
import {AuthService } from '../auth/auth.service'
import {Base64Helper} from '../utils/base64.helper'
import {Upload} from '../utils/base.service'
const removeDuplicates=function<T>(array:T[],cmpFn):T[]{
 return array.reduce((array,item)=>{if(!array.find((needle)=>cmpFn(needle,item)))array.push(item);return array},[])
}
@Component({
    templateUrl:'./feeds.component.html'
})
export class FeedComponent{
	feeds:Feed[]
	limit = 10;
	prevId: String;
	nextId: String;
	currentPageId: string;
	previousPages: string[]=[];
	feedsObservable:Observable<Feed[]>
	selectedImages:{file:File,base64:string}[]=[]
	@ViewChild('fileInput') fileInput: ElementRef;
	feed:Feed=new Feed()
	user:any
  loadingData=false
  currentlyPosting=false
    constructor(public feedService:FeedService,private router: Router,private sanitizer:DomSanitizer,private fileService:FileService,private authService:AuthService){
    }
    pickImage($event){

    	this.fileInput.nativeElement.click();
    }

    async preview(event){

      //if (!imageExtensions.includes(extention)) {
       // return;
      //}
      var reader=new FileReader();

      
      	
        let files=await Base64Helper.readFilesBase64(event.target.files)
        files.forEach((base64,index)=>{
          let item:File=event.target.files.item(index)
          this.selectedImages.push({file:item,base64:base64})
        })
        
      	// reader.addEventListener('load',()=>{
      	// 	this.selectedImages.push({file:item,base64:<string>reader.result})
      	// })
      	// reader.readAsDataURL(item);
      	

      // var reader=new FileReader();
      // this.fileService.uploadImage(this.selectedImage).then((res)=>{
      // 	console.log("Result",reader.result)
      // },function(err) {
      // 	// body...
      // 	console.log("Error",err)
      // })
      // reader.addEventListener('load',()=>{
      //      //this.imageSrc=this.sanitizer.bypassSecurityTrustStyle (`url(${reader.result})`);
      // },false);
      // if (this.selectedImage)
      //     reader.readAsDataURL(this.selectedImage);
  	}
   showFeeds(afterId?,firstTime=false){
     this.loadingData=true
		this.feedsObservable=this.feedService.getFeeds(this.limit,afterId,firstTime)
			.switchMap((feeds,index)=>{
				feeds=feeds.reverse()
				console.log(feeds)
				this.feeds=feeds.slice(0,this.limit)
				this.nextId=feeds[this.limit]?feeds[this.limit].id:this.nextId;
			/*setTimeout(()=>{
				this.ref.detectChanges()
			},100)*/

			console.log("Next",this.nextId)
        this.loadingData=false
				return Observable.of(this.feeds);
			}).catch((e)=>{
        this.loadingData=false
        return Observable.throw(e);
      });
	  }
    loadMore(){
      if(this.nextPage){
        //this.previousPages.push(this.currentPageId)
        this.feedsObservable=Observable.create((observer:Observer<Feed[]>)=>{
          this.loadingData=true
          observer.next(this.feeds)
          this.feedService.loadFeedsOnline(this.limit,this.nextId,false)
            .subscribe((feeds)=>{
              feeds=feeds.reverse()
              console.log("Next Page feeds",feeds)
              this.feeds=[...this.feeds,...feeds.slice(0,this.limit)]
              const filtered=[]
              this.feeds=removeDuplicates( this.feeds,(a,b)=>a.id==b.id)
              console.log("Next Page feeds concat()",this.feeds)
              this.nextId=feeds[this.limit]?feeds[this.limit].id:this.nextId;
              this.loadingData=false
              observer.next(this.feeds)
            },(error)=>{
              console.error("Error occured while loading more",error)
              alert("Network unreachable, please check your internet connection")
              this.loadingData=false
            })
        })
      } 
    }
   
    ngOnInit(){
    	console.log("Ng on init")
      window.scrollTo(0, 0);
    	this.user=this.authService.getCurrentUser()
    	console.log("User",this.user)
    	this.previousPages=[]
    	this.showFeeds(undefined,true)
    	//this.sanitizer.sanitize()
    }

  nextPage(){
		
		if (this.nextId) {
			this.currentPageId=this.feeds[0].id
			this.previousPages.push(this.currentPageId)
		    this.showFeeds(this.nextId)	
		}
		
	}
  formatFeedText(text){
    const maxLen=100
    if(text&&text.length>maxLen){
      text=text.substr(0,maxLen)+"........";
    }
    return text;
  }
	prevPage(){
		this.prevId=this.previousPages.pop()
		this.showFeeds(this.prevId)
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


  async addFeed(){
    this.feed.date_posted=(new Date).toJSON()
    this.feed.Updated_At=(new Date).toJSON()
    	this.feed.feed_type="TextPost"
    	this.feed.user_id=this.user.id
      if(this.selectedImages.length>0){
        this.feed.Images=this.selectedImages.map((item)=>{
          return {image_uploaded:true,path:"",upload:new Upload(item.file)}
        });
      }
    	try{
        this.currentlyPosting=true
    		await this.feedService.addFeed(this.feed)
    		alert("Post Uploaded successfully")
    	}catch(e){
    		console.error(e)
    		alert("Error uploading post")
    	}
      finally{
        this.currentlyPosting=false
      }
    	this.feed=new Feed()
      this.selectedImages=[]
  }
    gotoUserProfile(user_id:string){
    	this.router.navigate(['pages','profile',user_id])
    }
    showFeedDetails(feed:Feed){
    	console.log("navigating")
    	this.router.navigate(['pages','feeds', feed.id])
    }
}
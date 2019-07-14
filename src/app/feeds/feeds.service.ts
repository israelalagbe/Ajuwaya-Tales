import { Injectable } from '@angular/core';
import {Observable,Observer} from 'rxjs/Rx'
import {Feed} from './feed';
import {Comment} from './comment';
import { FirebaseApp } from 'angularfire2';
import {BaseService} from '../utils/base.service'
import { AngularFireDatabase, AngularFireList, QueryFn } from 'angularfire2/database';
import { Http } from '@angular/http';
import data from './data'
import {User} from '../auth/user'
import { AngularFireAuth } from 'angularfire2/auth';
import {AuthService} from '../auth/auth.service'
@Injectable()
export class FeedService extends BaseService{
    feedPath='feeds'
    userPath='users/'
    baseUrl='https://us-central1-edible-5b9bf.cloudfunctions.net/'
    feedsObservable:Observable<Feed[]>
    feedsObserver:Observer<Feed[]>
    constructor(db: AngularFireDatabase,firebaseApp: FirebaseApp,private http:Http,private firebaseAuth:AngularFireAuth,private authService:AuthService){
        super(db,firebaseApp);
        
    }
    getFeed(id):Observable<Feed>{
        let feed=this.loadFeedFromLocalStorage(id);
        if(feed){
            feed.userObservable=this.authService.getUserObservable(feed.user_id).first()
            return Observable.of(feed);
        }
        return this.getNode<Feed>(this.feedPath,id).map((feed)=>{
            feed.userObservable=this.getUser(feed.user_id)
            return feed;
        });
    }
    loadFeedFromLocalStorage(feed_id){
        let feeds=this.getLocalStorage<Feed[]>(this.feedPath);
        return feeds.find((feed:Feed)=>{
            return feed.id==feed_id;
        })
    }
    getFeeds(limit,afterId?,firstTime?:boolean):Observable<Feed[]>{
         let feeds=this.loadFeedsFromLocalStorage()
         console.log("Feeds",feeds,"First time",firstTime)
         if(firstTime&&feeds){
             if(!this.feedsObservable){
                 this.feedsObservable=Observable.create((observer:Observer<Feed[]>)=>{
                     this.feedsObserver=observer;
                     this.feedsObserver.next(feeds)
                 })
             }
             else{
                 this.feedsObserver.next(feeds)
             }
             console.log("First Time",feeds)
             this.loadFeedsOnline(limit,afterId).subscribe((feeds)=>{
                 this.feedsObserver.next(feeds)
                 //this.setLocalStorage(this.feedPath,feeds)
                 console.log("First time online",feeds)
             },(error)=>{
                 this.feedsObserver.error(error)
             })
                 
                 //this.setLocalStorage(this.feedPath,)
         }
         else if(this.feedsObservable){
             this.loadFeedsOnline(limit,afterId).subscribe((feeds)=>{
                 this.feedsObserver.next(feeds)
                 //this.setLocalStorage(this.feedPath,feeds)

             },(error)=>{
                 this.feedsObserver.error(error)
             })
         }
         else{
             this.feedsObservable=Observable.create((observer:Observer<Feed[]>)=>{
                     this.loadFeedsOnline(limit,afterId).subscribe((feeds)=>{
                         this.feedsObserver=observer;
                         this.feedsObserver.next(feeds)
                         //this.setLocalStorage(this.feedPath,feeds)
                     },(error)=>{
                         this.feedsObserver.error(error)
                     })
               })
         }
         return this.feedsObservable;
    }
    saveFeedToStorage(feeds:Feed[]){
        //delete 
        //this.setLocalStorage(this.feedPath,feeds)
        // .map((comments,index)=>{
        //         comments.map((comment)=>{
        //             comment.userObservable=this.getUser(comment.user_id);//.do((user)=>{console.log("User:",user)});
        //         })
    }
    loadFeedsFromLocalStorage():Feed[]{
        let feeds=this.getLocalStorage<Feed[]>(this.feedPath);
        if(!feeds)
            return null;
         feeds.forEach((feed)=>{
            feed.userObservable=this.getUser(feed.user_id);//.do((user)=>{console.log("Hello form local user observable",user)});//.do((user)=>{console.log("User:",user)});
         });
         return feeds;
    }
    loadFeedsOnline(limit,afterId?,saveLocal=true){
        return this.getNodesPage<Feed>(this.feedPath,limit,afterId)
         .map((comments,index)=>{
                if(saveLocal)    this.setLocalStorage(this.feedPath,comments);
                comments.map((comment)=>{
                    comment.userObservable=this.getUser(comment.user_id);//.do((user)=>{console.log("User:",user)});
                })
            return comments;
        });
    }
    getFeedsByUser(user_id:string,limit){
        const list=this.db.list<Feed>(`${this.rootBase}${this.feedPath}`,(ref)=>{
            let q=ref.orderByChild('user_id').equalTo(user_id);

            q=q.limitToLast(limit+1);
            return q;
        })
        return this.mapActions(list,true).map((feeds)=>{
            feeds.map((feed)=>{
                feed.userObservable=this.getUser(feed.user_id)
            })
            return feeds;
        }).first();
    }
    updateLike(feed:Feed):Promise<any>{
        return this.http.get(`${this.baseUrl}updateLikes?id=${feed.id}`,{}).toPromise();
    }
    updateViews(feed:string):Promise<any>{
        return this.http.get(`${this.baseUrl}updateViews?id=${feed}`,{}).toPromise();
    }
    getUser(ID):Observable<User>{
        /*let user=new User("Israel","israelalagbe53@gmail.com")
        user.ID="1"
        return Observable.of(user);*/
        return this.authService.getUserObservable(ID);
        //return this.getNode(this.userPath,ID);
        //return this.db.object<User>(`${this.userPath}${ID}`).valueChanges();
    }
    async addFeed(feed:Feed){
        if(feed.Images){
            for(let image of feed.Images){
                let result=await this.uploadFile(`${this.rootBase}/feeds/`,`${(new Date).getTime()}`,image.upload)
                image.path=result.url
                delete image.upload;
            }
        }

        let result =await this.addNode(this.feedPath,feed)
        this.incrementTotalFeeds()
        return result;
    }
    incrementTotalFeeds(){
        this.authService.addToUserRecordSummary(this.authService.getCurrentUser().id,'total_feeds',1)
        /*this.authService.getCurrentUserRecords()
            .first()
            .subscribe((record)=>{
                record=this.authService.checkUserRecord(record)
                let currentUser=this.authService.getCurrentUser()
                record.summary.total_feeds+=1
                this.updateNode(['user_records',currentUser.id,'summary',currentUser.id],record.summary);
            },(error)=>{
                console.warn("Unable to update total feeds",error)
            })*/
    }
}


@Injectable()
export class FeedServiceMock{
    feedPath='feeds'
    feedsObserver:Observer<Feed[]>
    constructor(){
        //super(db,firebaseApp);
    }
    getFeed(id):Observable<Feed>{
        return Observable.of( data.rootBase.feeds[id]);
    }
    objectToArray<T>(obj:any):T[]{
        let keys=Object.keys(obj)
        return keys.map((key)=>{
            let item=obj[key];
            item.id=key;
            return item;
        });

    }
    getFeedsByUser(user_id:string,limit){
        let feeds=this.objectToArray<Feed>(data.rootBase.feeds);
         return Observable.create((observer)=>{
                this.feedsObserver=observer;
                this.feedsObserver.next(feeds.filter((item)=>{
            //console.log(item.id,feed.id)
                if(item.user_id==user_id)
                    return  item;
                else
                    return null;
            }))
        }).map((feeds)=>{
            feeds.map((feed)=>{
                feed.userObservable=this.getUser(feed.user_id)
            })
            return feeds;
        });;
        
    }
    getUser(id:string){
        return Observable.of(data.rootBase.users[id]);
    }
    updateViews(feed:string){
        let feeds=this.objectToArray<Feed>(data.rootBase.feeds);
        this.feedsObserver&&this.feedsObserver.next(feeds.map((item)=>{
            //console.log(item.id,feed.id)
            if(item.id==feed)
                item.views++;
            return item;
        }));
        
    }
    updateLike(feed:Feed){
        if(!this.feedsObserver)
            return Promise.reject("No allowerd");
        let feeds=this.objectToArray<Feed>(data.rootBase.feeds);
        this.feedsObserver.next(feeds.map((item)=>{
            //console.log(item.id,feed.id)
            if(item.id==feed.id)
                item.likes++;
            return item;
        }))
        return null;
    }
    getFeeds(limit,afterId?):Observable<Feed[]>{
        //this.map
        return Observable.create((observer)=>{
            this.feedsObserver=observer;
            observer.next(this.objectToArray<Feed>(data.rootBase.feeds))
        })
    }
    
    

}
import {Observable} from 'rxjs/Rx'
import {User} from '../auth/user'
import {Upload} from '../utils/base.service'
export class Feed{
    id:string
    VideoDuration:string
    date_posted:string=(new Date).toJSON()
    Updated_At:string=(new Date).toJSON()
    feed_content:string
    feed_image:string
    feed_title:string
    feed_type:string
    has_picture:boolean
    image_uploaded:string
    likes:number=0
    meta:{congregation:string,service_state:string,set:string}
    total_comments:number=0
    user_id:string
    userObservable?:Observable<User>
    views:number=0
    Images:{image_uploaded:boolean,path:string,upload:Upload}[]
}
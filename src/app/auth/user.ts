export class User{
	id:string;
	display_name:string;
	email:string;
	small_picture_path:string
	username:string
	password?;
	about:string
	Updated_At=(new Date).toJSON()
	gender:"male"|"female";
}
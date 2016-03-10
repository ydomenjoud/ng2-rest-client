import {Injectable,Inject} from "angular2/core";
import {Http} from "angular2/http";
import RESTClient from "../../src/RESTClient";

@Injectable()
class CommentService extends RESTClient {

    protected _url = "http://jsonplaceholder.typicode.com/comments";

    constructor( @Inject(Http) _http ) { // OR @Inject(AuthHttp) with angular2-jwt
        super(_http);
    }
}
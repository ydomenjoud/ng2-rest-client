import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable} from 'rxjs/Rx';


/**
 * REST CLIENT for standards POST, GET, PUT, DELETE request
 */
export class RESTClient<T extends {_id: string}> {

    protected _url; // url of rest service

    /**
     * default constructor for the REST client
     * @param _http http own implementation
     */
    constructor( private _http: Http ) {}

    /**
     * POST request meaning creation
     * @param object to post
     * @param search extra params send trought http request
     * @return {Observable<T>} an obversable for the posted object
     */
    public post(object:T, params?: {}):Observable<T>{
        let options = {
            method: 'POST',
            body: JSON.stringify(object),
            headers: {}
        };
        return this._request(options, params);
    }

    /**
     * PUT request meaning update
     * @param object to update
     * @param search extra params send trought http request
     * @return {Observable<T>} an observable for the updated object
     */
    public put(object:T, params?: {}):Observable<T>{
        let options = {
            url: object._id,
            method: 'PUT',
            body: JSON.stringify(object)
        };
        return this._request(options, params);
    }

    /**
     * GET request
     * @param _id to get information
     * @param search extra params send trought http request
     * @return {Observable<T>} the requested object
     */
    public get(_id:string, params?: {}):Observable<T>{
        let options = {
            method: 'GET',
            url: _id
        };
        return this._request(options, params);
    }

    /**
     * GET request
     * @param search extra params send trought http request
     * @return {Observable<T[]>} the requested object
     */
    public list(params?: {}):Observable<T[]>{
        let options = {
            method: 'GET'
    };
        return this._request(options, params);
    }

    /**
     * DELETE object
     * @param object to delete
     * @param search extra params send trought http request
     * @return {Observable<T>} the objected deleted
     */
    public delete(object:T, params?: {}):Observable<T>{
        let options = {
            url: object._id,
            method: 'DELETE'
        };
        return this._request(options, params);
    }

    /**
     * basic request
     * @param options
     * @return {Observable<Response>}
     */
    private _request(options: {url?: string, search?: URLSearchParams}, params?: {}){
        // prefix url
        options.url = this._url + "/" + options.url;

        // set search params
        if( params ){
            let params = new URLSearchParams();
            for( let property in params){
                params.set(property, params[property]);
            }
            options.search = params;
        }

        // send request
        return this
            ._http
            .request(this._url, options)
            .map(response => response.json()) // map to JSON
            .catch(this.handleError); // catch error
    }


    /** facilities **/


    /**
     * Update Or Create object
     * @return {Observable<T>}
     */
    public save(object:T, params?: {}):Observable<T> {
        return ( object && object._id ) ? this.put(object, params) : this.post(object, params);
    }



    /**
     * custom error handler
     * @param error
     * @returns {ErrorObservable}
     */
    protected handleError (error: Response) {
        return Observable.throw(error|| 'Server error');
    }
}

export default RESTClient;

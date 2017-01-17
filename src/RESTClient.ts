
import {Http, Response, URLSearchParams, RequestOptionsArgs} from "@angular/http";
import {Observable} from 'rxjs/Rx';

/**
 * @see https://github.com/ydomenjoud/ng2-rest-client
 * REST CLIENT for standards POST, GET, PUT, DELETE request
 */
export class RESTClient<T extends {id: number}> {

  protected _url; // url of rest service

  /**
   * default constructor for the REST client
   * @param _http http own implementation
   */
  constructor( private _http: Http ) {}

  /**
   * POST request meaning creation
   * @param object to post
   * @param params extra params send trought http request
   * @return {Observable<T>} an obversable for the posted object
   */
  public post(object:T, params?: {}):Observable<T>{
    let options = {
      method: 'POST',
      body: JSON.stringify(object)
    };
    return this._request(options, params);
  }

  /**
   * PUT request meaning update
   * @param object to update
   * @param params extra params send trought http request
   * @return {Observable<T>} an observable for the updated object
   */
  public put(object:T, params?: {}):Observable<T>{
    let options = {
      url: object.id+"",
      method: 'PUT',
      body: JSON.stringify(object)
    };
    return this._request(options, params);
  }

  /**
   * GET request
   * @param id to get information
   * @param params extra params send trought http request
   * @return {Observable<T>} the requested object
   */
  public get(id:string, params?: {}):Observable<T>{
    let options = {
      method: 'GET',
      url: id
    };
    return this._request(options, params);
  }

  /**
   * GET request
   * @param params extra params send trought http request
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
   * @param params extra params send trought http request
   * @return {Observable<T>} the objected deleted
   */
  public delete(object:T, params?: {}):Observable<T>{
    let options = {
      url: object.id+"",
      method: 'DELETE'
    };
    return this._request(options, params);
  }

  /**
   * basic request
   * @param options
   * @param params extra params send trought http request
   * @return {Observable<Response>}
   */
  private _request(options: RequestOptionsArgs, params?: {}){
    // prefix url
    options.url = this._url  + ( options.url ? "/"+options.url :  "" );

    // set search params
    if(  params ){
      let urlSearchParams = new URLSearchParams();
      for( let property in params){
        urlSearchParams.append(property, params[property]);
      }
      options.search = urlSearchParams;
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
    return ( object && object.id ) ? this.put(object, params) : this.post(object, params);
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

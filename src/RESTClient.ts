import {Http,Response} from "angular2/http";
import {Observer,Observable, Subject, ReplaySubject} from 'rxjs/Rx';

/**
 * REST CLIENT for standards POST, GET, PUT, DELETE request
 */
class RESTClient<T extends {id:string}> {

    public observable$:Observable<T[]> = null; // observable for T[]
    private _observer: Observer; // observer
    private _store:T[]; // store T[]
    protected _url; // url of rest service

    /**
     * default constructor for the REST client
     * @param _http http implementation
     */
    constructor( private _http: Http ) {
        this.observable$ = new Observable(observer => this._observer = observer).share();
        this._store = []; // empty array at start
    }

    /**
     * GET
     * Get single <T> by Id
     * @return {Observer<T[]>}
     */
    public one(obj:T):Observable<T>{
        return this._http
            .get(this._url+"/"+obj.id)
            .map(response => response.json())
            .catch(this.handleError);
    }

    /**
     * GET
     * Get list of <T> and
     * @return {Observer<T[]>}
     */
    public list():Observable<T[]>{
        return this._http
            .get(this._url)
            .map(response => response.json())
            .map(response => {
                // update store and call next for subscriber
                this._store = response;
                this._observer.next(this._store);
            })
            .catch(this.handleError);
    }

    /**
     * POST
     * Create a new object
     * @param obj the <T> object to create
     * @returns {Observer<T>} observer for object created
     */
    public create(obj:T):Observable<T>{
        return this._http
            .post(this._url, JSON.stringify(obj))
            .map(response => response.json())
            .catch(this.handleError)
    }

    /**
     * PUT
     * Update an object
     * @param obj the <T> object to update
     * @returns {Observer<T>} observer for object updated
     */
    public update(obj:T):Observable<T> {
        return this._http
            .put(this._url+"/"+obj.id, JSON.stringify(obj))
            .map(response => response.json())
            .map(response => {
                this._store.some((c, i) => {
                    if (c.id === obj.id) {
                        this._store[i] = <T>response;
                        // update store
                        this._observer.next(this._store);
                        return true;
                    }
                    return false;
                });

            })
            .catch(this.handleError);
    }

    /**
     * DELETE
     * Delete an object
     * @param obj the object to delete
     * @returns {Observer<T>} observer for object deleted
     */
    public delete(obj:T):Observable<T> {
        return this._http
            .delete(this._url+"/"+obj.id)
            .map(response => response.json())
            .map(response => {
                // browse store to remove deleted T
                this._store.some((c, i) => {
                    if (c.id === obj.id) {
                        this._store.splice(i, 1);
                        // update store
                        this._observer.next(this._store);
                        return true;
                    }
                    return false;
                });

            })
            .catch(this.handleError);
    }

    /**
     * custom error handler
     * @param error
     * @returns {ErrorObservable}
     */
    protected handleError (error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}

export default RESTClient;
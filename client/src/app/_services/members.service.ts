import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})

export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = []; // to avoid making API request every time we refresh the page, to store it
  memberCache = new Map(); // a dictionnary with key and values
  user: User;
  userParams: UserParams;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
    })
  };

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      user => { this.user = user; this.userParams = new UserParams(user); }
    )}

  getMembers(userParams: UserParams) { // return a Observable<Member[]> 
    // we store in our cache the API members to avoid making an API call everytime, to avoid loading page
    var response = this.memberCache.get(Object.values(userParams).join('-'));// 18-99-1-5-lastActive-male (key = numbers and values = lastActive, NewestMember, the age value etc)
    if (response) {
      return of(response);
    }


    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe( // bc it returns an Observable, need to use the pipe method
      map(response => {
        this.memberCache.set(Object.values(userParams).join("-"), response);
        return response;
      })
      );
    // old : return this.http.get<Member[]>(this.baseUrl + 'users', this.httpOptions);
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()] // spread operator (...) : copy all or part of an existing array or object into another array or object.
      // the cache for each link we visited about a specific age, a specific filter create a cache array that contains the specific members
      // so we take all of these arrays and put it in one array
      .reduce((arr, elem) => arr.concat(elem.result), []) // reduce arrays in something else, we want a single array of members
      .find((member: Member) => member.username === username); // find our member in the array

    if (member) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => { 
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate: string, pageNumber, pageSize) {
    // let params = getPaginationHeaders(pageNumber, pageSize);
    // params = params.append('predicate', predicate);
    // return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }
}

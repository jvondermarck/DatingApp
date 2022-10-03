import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = []; // to avoid making API request every time we refresh the page, to store it

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
    })
  };

  constructor(private http: HttpClient) { }

  getMembers() { // return a Observable<Member[]> 
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users', this.httpOptions).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
    // old : return this.http.get<Member[]>(this.baseUrl + 'users', this.httpOptions);
  }

  getMember(username: string) {
    const member = this.members.find(x => x.username === username);
    if(member !== undefined) return of(member); // return the member if it is defined
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
}

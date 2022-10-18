import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

@Injectable({
    providedIn: 'root'
})

// add the class in the app-routing.module.ts
// to get the data before the structure template initialize (the html code for example), for conditionnal
// display the content after it received what we want before
export class MemberDetailedResolver implements Resolve<Member> {

    constructor(private memberService: MembersService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.memberService.getMember(route.paramMap.get('username'));
    }

}
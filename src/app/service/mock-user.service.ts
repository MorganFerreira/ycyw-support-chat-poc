import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MockUser } from '../model/mockUser';


@Injectable({ providedIn: 'root' })
export class MockUserService {
  private currentUserSubject = new BehaviorSubject<MockUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  async loadUsers(): Promise<MockUser[]> {
    return firstValueFrom(this.http.get<MockUser[]>('assets/mock/testUser.json'));
  }

  setUser(u: MockUser) {
    this.currentUserSubject.next(u);
  }

  get currentUser(): MockUser | null {
    return this.currentUserSubject.value;
  }
}

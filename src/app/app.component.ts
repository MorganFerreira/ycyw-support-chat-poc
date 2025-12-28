import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MockUser } from './model/mockUser';
import { MockUserService } from './service/mock-user.service';
import { TalkjsService } from './service/talkJs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ycyw-support-chat-poc';

  users: MockUser[] = [];
  selected: MockUser | null = null;

  @ViewChild('talkjsContainer', { static: false })
  talkjsContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private auth: MockUserService,
    private talk: TalkjsService
  ) {}

  async ngOnInit() {
    this.users = await this.auth.loadUsers();
  }

  async login(u: MockUser) {
    this.selected = u;
    this.auth.setUser(u);

    const support = this.users.find(x => x.id === 'support');
    if (!support) throw new Error('Support user missing in mocks');

    await this.talk.initSession(u);

    setTimeout(async () => {
      if (!this.talkjsContainer?.nativeElement) return;
      await this.talk.mountSupportChat(this.talkjsContainer.nativeElement, u, support);
    });
  }

  logout() {
    this.talk.destroy();
    this.selected = null;
  }

  ngOnDestroy(): void {
    this.talk.destroy();
  }
}

import { Injectable } from '@angular/core';
import Talk from 'talkjs';
import { MockUser } from '../model/mockUser';

@Injectable({ providedIn: 'root' })
export class TalkjsService {
  private session: Talk.Session | null = null;
  private chatbox: Talk.Chatbox | null = null;

  private appId = 'tKQh4uLO';

  async initSession(me: MockUser): Promise<void> {
    await Talk.ready;

    const meUser = new Talk.User({
      id: me.id,
      name: me.username,
      email: me.email,
      photoUrl: me.photoUrl,
      role: me.role === 'support' ? 'support' : 'customer'
    });

    this.session = new Talk.Session({
      appId: this.appId,
      me: meUser
    });
  }

  async mountSupportChat(
    container: HTMLElement,
    me: MockUser,
    support: MockUser
  ): Promise<void> {
    if (!this.session) throw new Error('TalkJS session not initialized');

    const meUser = new Talk.User({
      id: me.id,
      name: me.username,
      email: me.email,
      photoUrl: me.photoUrl,
      role: me.role === 'support' ? 'support' : 'customer'
    });

    const supportUser = new Talk.User({
      id: support.id,
      name: support.username,
      email: support.email,
      photoUrl: support.photoUrl,
      role: 'support'
    });

    // Identifiant stable de conversation
    const clientId = me.role === 'support' ? 'morgan' : me.id;
    const conversationId = `support_${clientId}`;

    const conversation = this.session.getOrCreateConversation(conversationId);
    conversation.setParticipant(meUser);
    conversation.setParticipant(supportUser);

    this.chatbox = this.session.createChatbox();
    this.chatbox.select(conversation);
    this.chatbox.mount(container);
  }

  destroy(): void {
    this.chatbox?.destroy();
    this.chatbox = null;
    this.session?.destroy();
    this.session = null;
  }
}

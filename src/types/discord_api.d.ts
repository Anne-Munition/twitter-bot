interface MessageSentResponse {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    global_name: null;
    display_name: null;
    avatar: string;
    avatar_decoration: null;
    discriminator: string;
    public_flags: number;
    bot: true;
  };
  attachments: [];
  embeds: [];
  mentions: [];
  mention_roles: [];
  pinned: false;
  mention_everyone: false;
  tts: false;
  timestamp: string;
  edited_timestamp: null;
  flags: number;
  components: [];
  referenced_message: null;
}

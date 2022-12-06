# Better-SUS-Bot

Better-SUS-Bot is a Bot made to rewrite all the mistakes made in [SUS-Bot](https://github.com/plastic-flasche/SUS-bot) by [Plastik-Flasche](https://github.com/plastik-flasche) like 
```js 
if(variable === undefined)
```

## How to use

### Self Hosting

1. Clone the Repository
2. Create the `.env` file and fill it with the following content:

```env
TOKEN= # Your Discord Bot Token
PREFIX= # The Prefix you want to use. For example: !
PORT= # Port you want your Website to run on. Example: 80 (http)
MONGODB= # Your mongodb connection string
```

3. Open CMD
4. Navigate to the Repository
5. Install the Dependencies with `npm i`
6. Run the Bot with `node .`
7. Enjoy

### Invite the Bot

Disclaimer! The Bot is currently under heavy development so it might not be online all the time.

1. Go to the [Invite Page](https://discord.com/api/oauth2/authorize?client_id=1049581652181008417&permissions=8&scope=bot%20applications.commands)
2. Select your Server
3. Grant the Permissions
4. Enjoy

P.S. If you want to invite the Bot to your Server, you need to have the `Manage Server` Permission.

P.P.S. The prefix for the hosted Version is `!`

## Commands

- [ ] means work in progress!
- [x] means fully functional!

### General

- [ ] `help` - Shows the Help Page
- [x] `info` - Shows some Information about the Bot
- [x] `invite` - Creates an Invite Link for the Server
- [x] `inviteBot` - Shows the Invite Link for the Bot
- [x] `serverinfo` - Shows some information about the server
- [x] `ping` - Shows the Ping of the Bot
- [x] `uptime` - Shows the uptime of the bot

### Moderation

- [x] `clear` - Deletes a certain amount of Messages
- [x] `lock` - Locks a Channel
- [x] `unlock` - Unlocks a Channel
- [x] `nickname` - Set the Nickname of a Member
- [x] `remove-nickname` - Removes the Nickname from a Member
- [x] `set-counter-channel` - Sets the counter channel
- [x] `set-goodbye-channel` - Sets the goodbye channel
- [x] `set-welcome-channel` - Sets the welcome channel
- [x] `slowmode` - Sets the Slowmode of a Channel
- [x] `unban` - Unbans a Member
- [ ] `tempban` - Temporarily Bans a Member
- [ ] `warn` - Warns a Member
- [ ] `warnings` - Shows the Warnings of a Member
- [ ] `removeWarning` - Removes a Warning from a Member
- [ ] `resetWarnings` - Resets the Warnings of a Member

### Music

- [x] `play` - Plays a Song
- [x] `skip` - Skips the current Song
- [x] `stop` - Stops the Music
- [x] `queue` - Shows the Queue
- [x] `nowPlaying` - Shows the current Song
- [x] `pause` - Pauses the Music
- [x] `resume` - Resumes the Music
- [x] `loop` - Loops the Queue
- [x] `shuffle` - Shuffles the Queue
- [x] `clear-queue` - Clears the Queue

### Economy

- [x] `beg` - beg for money
- [x] `bal` - shows your current balance
- [ ] `dep` - deposit money from your wallet into your bank
- [ ] `withdraw` - withdraw money from your bank
- [ ] `coinflip` - guess heads or tails and bet some money then flip a coin to either loos all that money or double it

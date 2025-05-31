# Todo List

![Screenshot](./assets/screenshot.jpg)

For small teams, Todo List helps you get things done. Simple!

You can immediately deploy your version with the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fblackmann%2Ftodo-list&env=COOKIE_SECRET&integration-ids=oac_3sK3gnG06emjIEVL09jjntDD)

## Development

Yarn is the package manager. Run `yarn` to install the dependencies.

Prisma is the ORM. Run `yarn prisma generate` to generate the Prisma client and `yarn prisma migrate deploy` to apply the migrations.

Postgres is the database. Run `yarn prisma studio` to open the Prisma studio and view records. Or you can use a GUI app like TablePlus or whatever you like.

### Environment Variables

```bash
DATABASE_URL="postgresql://postgres@127.0.0.1:5432/todolist"
COOKIE_SECRET="somerandomstring"
```

## Webhook Integration

Todo List provides a flexible webhook system that allows you to send event notifications to any service or integration.

### How It Works

1. When events occur in the app (like task creation, updates, etc.), the `sendWebhook` function is called
2. This function sends a typed event payload to the URL specified in the `WEBHOOK_URL` environment variable
3. You can configure this URL to point to:
   - An external service (like Slack, a custom API, etc.)
   - Our built-in `/webhook/discord` endpoint to use our Discord integration
   - Your own custom integration

### Configuration Options

There are two main ways to set up the webhook system:

#### Option 1: Use our built-in Discord integration

```bash
# Point to our internal webhook endpoint
WEBHOOK_URL="http://localhost:5173/webhook/discord"

# Your Discord webhook URL
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your-discord-webhook-url"
```

With this setup, events from the app are sent to our `/webhook/discord` endpoint, which formats them and forwards them to Discord.

#### Option 2: Send directly to your own endpoint

```bash
# Point directly to your external service
WEBHOOK_URL="https://your-custom-webhook-receiver.com/endpoint"
```

With this setup, events are sent directly to your specified endpoint, and you're responsible for handling and processing them.

### Event Types

Todo List sends strongly-typed JSON events for various actions in the system such as:

- Task creation
- Task updates
- Status changes
- Task assignments
- Task deletions
- User joins

Each event includes the relevant data needed to process the event, including task information and user details.

### Discord Integration

Our built-in Discord integration formats events into rich embeds with:

- Color-coding based on event type
- User avatars
- Formatted task information
- Timestamps
- Direct links back to tasks

### Creating Your Own Integration

You can create your own integration in two ways:

1. **External service**: Set `WEBHOOK_URL` to your external service and process the events there
2. **Internal integration**: Create a new route in the app, set `WEBHOOK_URL` to point to it, and implement your processing logic

Example of a custom integration route:

```typescript
// Example: app/routes/webhook.my-integration.tsx
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") throw methodNotAllowed();
  
  // Get the webhook payload
  const event = await request.json();
  
  // Process the event and send to your service
  // ...your custom logic here...
  
  return json({ success: true });
}
```

Then set `WEBHOOK_URL="http://localhost:5173/webhook/my-integration"` in your environment.



# Sync Meetup Events Action

A GitHub Action to automatically sync events from a Meetup group to a JSON file, including scraping event images.

## Features

- Scrapes upcoming events from a Meetup group page
- Extracts event details: ID, name, link, date
- Downloads event images from Meetup pages
- Updates existing JSON file with new events
- Maintains existing events and updates missing images

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `json-path` | Path to the JSON file to update | No | `public/data/issues.json` |

| `meetup-org` | Meetup organization (slug) to sync events from, e.g. `ghspain` | No | `ghspain` |

## Outputs

None

## Example Usage

### Local Repository (as done here)

```yaml
name: Sync Meetup Events

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:

jobs:
  sync-events:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install action dependencies
      run: |
        cd actions/sync-meetup-events
        npm ci

    - name: Sync events from Meetup
      uses: ./actions/sync-meetup-events
      with:
        json-path: 'public/data/issues.json'
        meetup-org: 'ghspain'

    - name: Commit and push changes
      if: steps.verify-changed-files.outputs.changed == 'true'
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add public/data/issues.json
        git commit -m "Sync events from Meetup [automated]"
        git push
```

### Marketplace Usage (future)

Once published to GitHub Marketplace:

```yaml
- name: Sync events from Meetup
  uses: your-org/sync-meetup-events@v1
  with:
    json-path: 'data/events.json'
    meetup-org: 'my-meetup-org'
```

## Requirements

- Node.js 20+
- Puppeteer-compatible environment (GitHub Actions Ubuntu runners work)

## Dependencies

- `puppeteer`: For browser automation and scraping
- `cheerio`: For HTML parsing

## How It Works

1. Launches a headless browser and navigates to the Meetup group events page
2. Scrapes event cards to extract event details
3. For each event, fetches the individual event page to get the image from meta tags
4. Updates the specified JSON file with new events and missing images
5. Sorts events by date (newest first)

## JSON Structure

The action updates a JSON file with an array of event objects:

```json
[
  {
    "event_id": "123456789",
    "event_name": "Event Title",
    "event_link": "https://www.meetup.com/group/events/123456789/",
    "event_date": "10/28/2025 5:45:00 PM",
    "event_image": "https://secure.meetupstatic.com/photos/event/...jpeg"
  }
]
```

## Development

### Local Testing

```bash
cd actions/sync-meetup-events
npm install
node index.js
```

### Publishing to Marketplace

1. Create a new repository for the action
2. Copy the `action.yml`, `index.js`, and `package.json`
3. Tag a release (e.g., `v1.0.0`)
4. The action will be available as `uses: your-org/sync-meetup-events@v1`

## Limitations

- Default organization is `ghspain`, but you can override it by passing the `meetup-org` input to the action.
- Assumes event dates are in a specific format
- Requires internet access for scraping

Note: Inputs are exposed to the Node.js action as environment variables `INPUT_JSON_PATH` and `INPUT_MEETUP_ORG`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License

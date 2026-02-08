# @solteq/strapi-plugin-medusa-picker

A Strapi v5 custom field plugin for browsing and selecting products, categories, and collections from a Medusa eCommerce backend.

## Features

- **Custom Field**: Adds a "Medusa Picker" field type to Content-Type Builder (CUSTOM tab)
- **Modal Picker UI**: Browse and search Medusa entities with grid/list views
- **Multi-select**: Select multiple products, categories, or collections
- **Type Filtering**: Switch between Products, Categories, and Collections
- **Search**: Real-time search with debouncing
- **Pagination**: Configurable page size (15, 30, 50 items)
- **Admin Settings**: Configure Medusa API connection via Settings page

## Requirements

- Strapi v5
- Node.js 18+
- A running Medusa v2 backend with a Publishable API Key

## Installation

```bash
npm install @solteq/strapi-plugin-medusa-picker
```

## Configuration

Enable the plugin in `config/plugins.ts`:

```typescript
export default () => ({
  'medusa-picker': {
    enabled: true,
  },
});
```

Rebuild and restart Strapi:

```bash
npm run build
npm run develop
```

### Connect to Medusa

1. Go to **Settings → Medusa Picker** in Strapi admin
2. Enter your **Medusa API URL** (e.g., `http://localhost:9000`)
3. Enter your **Publishable API Key** (from Medusa Admin → Settings → Publishable API Keys)
4. Click **Save**
5. Optionally click **Test Connection** to verify

### Environment Variable

You can set a default Medusa URL via environment variable:

```
MEDUSA_BACKEND_URL=http://localhost:9000
```

This is used as the initial value when no settings have been saved yet.

## Usage

### Adding the Field

1. Go to **Content-Type Builder**
2. Select or create a content type
3. Click **Add another field** → **CUSTOM** tab
4. Select **Medusa Picker**
5. Configure field name and save

### Using the Picker

1. Edit a content entry
2. Click **Select from Medusa**
3. Browse/search entities, switch types, select items
4. Click **Select** to confirm

### Data Format

Selected items are stored as a JSON string:

```json
[
  { "medusa_id": "prod_01H123ABC", "type": "product", "name": "Blue T-Shirt" },
  { "medusa_id": "pcol_01H456DEF", "type": "collection", "name": "Summer Sale" }
]
```

| Field | Description |
|-------|-------------|
| `medusa_id` | The Medusa entity ID |
| `type` | `product`, `collection`, or `category` |
| `name` | Cached display name |

### Storefront Usage

The storefront should use the stored `medusa_id` values to fetch full entity data directly from Medusa:

```javascript
const references = await strapi.find('api::page.page', { populate: ['medusa_field'] });
const productIds = references
  .filter(r => r.type === 'product')
  .map(r => r.medusa_id);

const products = await medusa.products.list({ id: productIds });
```

## Development

```bash
npm install
npm run build    # Build for production
npm run watch    # Watch mode for development
npm run verify   # Verify plugin structure
```

### Local Development with Strapi

```bash
npm run watch:link
# In your Strapi project:
# yalc add @solteq/strapi-plugin-medusa-picker
# npm run develop
```

## License

MIT

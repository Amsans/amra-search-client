# Amra Search Client

A lightweight client application for searching text in the pandekt database using the Amra Search API.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/amra-search-client.git
   ```

2. Navigate to the project directory:
   ```
   cd amra-search-client
   ```

3. Open `index.html` in your web browser or deploy the files to a web server.

## Configuration

Before using the application, you need to configure the API endpoint. Open `script.js` and update the `API_BASE_URL` constant with your actual API URL:

```javascript
const API_BASE_URL = ''; // Replace with your actual API URL, e.g., 'https://api.example.com'
```

**Important:** The application will not work until you set a valid API URL. The API endpoint should support GET requests in the format `<API_URL>/search?term=<encoded_search_term>&offset=<offset_value>`.


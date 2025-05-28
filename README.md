# Amra Search Client

A lightweight client application for searching text in the Pandekt database using the Amra Search API.

## Features

- Simple and intuitive search interface
- Beautiful modern display of search results
- Highlighted search terms in results
- Pagination for large result sets
- Responsive design that works on desktop and mobile devices
- Loading indicators for better user experience
- Error handling

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

## Usage

1. Enter a search term in the search box
2. Click the "Search" button or press Enter
3. View the search results with highlighted matching terms
4. Use the pagination controls at the bottom to navigate through multiple pages of results
5. Click on "View original" to open the source document in a new tab

## API Response Format

The application expects the API to return responses in the following format:

```json
{
    "took": 19,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 84,
        "max_score": 2.8760927,
        "hits": [
            {
                "_index": "pandekt",
                "_type": "miteuma",
                "_id": "o7qJE5cBpOxJKFgl9Jpk",
                "_score": 2.8760927,
                "_source": {
                    "book": "Эпистолэ",
                    "author": "Митэвма Атархата",
                    "miteuma": "О фанатизме",
                    "enon": "IV",
                    "text": "...",
                    "url": "http://example.com/path/to/document"
                },
                "highlight": {
                    "text": [
                        "Example highlighted text with <em>search term</em> emphasized"
                    ]
                }
            }
        ]
    }
}
```

## Development

The application consists of three main files:

- `index.html` - The HTML structure of the application
- `styles.css` - CSS styles for the application
- `script.js` - JavaScript code for handling the search functionality

To modify the application, edit these files as needed.

## License

[MIT License](LICENSE)

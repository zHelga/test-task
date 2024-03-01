const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Проверяем, что запрос идет на наш эндпоинт
  if (!event.path.startsWith('/api/')) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' })
    };
  }

  const apiUrl = 'http://api.valantis.store:40000' + event.path.replace('/api', '');
  
  try {
    // Проксируем запрос к API
    const response = await fetch(apiUrl, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        'Content-Type': 'application/json',
      },
      body: event.body,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

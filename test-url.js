const url = 'http://localhost:8065';
try {
  const urlObj = new URL(url);
  console.log('URL:', url);
  console.log('Protocol:', urlObj.protocol);
  console.log('Hostname:', urlObj.hostname);
  console.log('Port:', urlObj.port);
  console.log('Port extracted:', urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80));
} catch (error) {
  console.error('Error:', error.message);
}

// backend/debug-string-response.js
import axios from 'axios';
import fs from 'fs';

const debugStringResponse = async () => {
  try {
    const response = await axios.get('https://cexfind-min-poyflf5akq-nw.a.run.app');
    
    console.log('Response type:', typeof response.data);
    console.log('Response status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content length:', response.data.length);
    
    // Save the full response to a file
    fs.writeFileSync('string-response.txt', response.data);
    console.log('Full response saved to string-response.txt');
    
    // Show the first part of the response
    console.log('\n--- First 500 characters ---');
    console.log(response.data.substring(0, 500));
    
    // Show the last part of the response
    console.log('\n--- Last 500 characters ---');
    console.log(response.data.substring(response.data.length - 500));
    
    // Check what format it might be
    const trimmed = response.data.trim();
    
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      console.log('\n🔍 Format: HTML');
    } else if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
      console.log('\n🔍 Format: XML');
    } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      console.log('\n🔍 Format: JSON (as string)');
      try {
        const parsed = JSON.parse(trimmed);
        console.log('JSON parse successful, type:', typeof parsed);
        console.log('Keys:', Array.isArray(parsed) ? `Array[${parsed.length}]` : Object.keys(parsed));
      } catch (e) {
        console.log('JSON parse failed:', e.message);
      }
    } else if (response.data.includes(',') && response.data.includes('\n')) {
      console.log('\n🔍 Format: CSV or delimited text');
      const lines = response.data.split('\n');
      console.log('Number of lines:', lines.length);
      console.log('First line:', lines[0]);
    } else {
      console.log('\n🔍 Format: Unknown text format');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response type:', typeof error.response.data);
    }
  }
};

debugStringResponse();
async function fetchData() {
    try {
      const response = await fetch('https://elosystemv1.onrender.com/name');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      document.getElementById('content').innerText = data;
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById('content').innerText = 'Error fetching data';
    }
  }
  
  document.addEventListener('DOMContentLoaded', fetchData);
  
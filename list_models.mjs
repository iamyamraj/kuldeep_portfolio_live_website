const apiKey = "AIzaSyA42tLZW012miPjq5hSZdG-2Frz6alocUw";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods.join(',')));
    } else {
      console.log(data);
    }
  })
  .catch(console.error);

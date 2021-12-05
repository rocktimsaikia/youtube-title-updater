require('dotenv').config();
const { google } = require('googleapis');
const VIDEO_ID = 'I4wRB7NujEY';

(async () => {
  // Init auth
  const authClient = new google.auth.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  authClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const youtube = google.youtube({
    auth: authClient,
    version: 'v3',
  });

  // Get video details
  const response = await youtube.videos.list({
    id: VIDEO_ID,
    part: 'statistics,snippet',
  });

  const { snippet } = response.data.items[0];
  const { title, description } = snippet;

  // update the description version number
  const updatedDescVersion = parseInt(description.match(/\d+/g)) + 1;
  const updatedDesc = description.replace(/\d+/g, updatedDescVersion);

  // update title of the video with a new date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const updatedTitle = `Today is ${today}`;

  const updatedResponse = await youtube.videos.update({
    part: 'snippet',
    requestBody: {
      id: VIDEO_ID,
      snippet: {
        ...snippet,
        title: updatedTitle,
        description: updatedDesc,
      },
    },
  });
  console.log(updatedResponse.status);
})();
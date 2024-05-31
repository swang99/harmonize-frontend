# Harmonize

![Team Photo](src/img/team_photo_1.JPG?raw=true)

Figma:
[Our Figma link](https://www.figma.com/design/d1LRKIo9vALvQktj60IxuR/mockup-draft-1?node-id=0%3A1&t=XEGMeyuZymvdAH84-1)

Our App:
Welcome to Harmonize, the ultimate social experience for music lovers! Sign in with your Spotify account and dive into a vibrant community of music enthusiasts. Follow your friends to discover the songs they’re loving, or share your own favorite tracks with personalized posts. Connect, share, and celebrate music together with Harmonize!


## Architecture
- [Frontend](https://harmonize-client.onrender.com) [Repo](https://github.com/dartmouth-cs52-24s/project-client-spotify-sharing):
  - Node.js
  - React
  - Chakra UI - Frontend Components Library
  - Spotify API - Authorization and using data
- [Backend](https://project-api-spotify-sharing.onrender.com) [Repo](https://github.com/dartmouth-cs52-24s/project-api-spotify-sharing)
  - MongoDB
  - Express

TODO:  descriptions of code organization and tools and libraries used

## Setup
### Frontend:
- Clone Repo, npm install, npm run dev
- In src/store/profile-slice.js, ensure that the ROOT_URL points to whichever backend/DB you want to use (default is the deployed backend).
- To gain access to the Spotify API Client ID (in src/utils/SpotifyAuth.js), ask Brendan to add you to the Spotify API app. Alternatively, [create](https://developer.spotify.com/dashboard/create) a new Spotify API app and set the Redirect URI to the /home page of your Frontend (could be [http://localhost:5173/home](http://localhost:5173/home)) or the deployed url. Select the Web API and Web Playback SDK options.

### Backend:
- Clone Repo, npm install, npm start
- Make sure your frontend is pointing to the correct backend (ROOT_URL in src/store/profile-slice.js of the frontend), should end in /api.

## Deployment (using Render)
### Frontend:
- Create a static site using this repository on Render.
- Use the main branch
- Build Command: npm install && npm run build
- Publish directory: dist
- Make sure the ROOT_URL in src/store/profile-slice.js is pointing at the correct backend (deployed url), and the Redirect URI in the Spotify App is updated to reflect your new deployed frontend URL!

### Backend: 
- Create a web service using the [backend](https://github.com/dartmouth-cs52-24s/project-api-spotify-sharing) on Render.
- Use the main branch
- Build Command: npm install && npm run build
- Start Command: npm run prod
- Environment Variables: Set MONGODB_URI to link to your MongoDB account.

## Authors

Emily Gao, Eric Leung, Ben Sheldon, Brendan Shaw, & Stephen Wang

## Acknowledgments

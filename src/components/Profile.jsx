import React from 'react';
import { useParams } from 'react-router';

const testProfile = {
  name: 'Stephen Wang',
  email: 'swang@secret.io',
  password: '',
  followers: ['User 1', 'User 2'],
  following: ['User 3', 'User 4'],
  highlights: ['Perfect Melody', 'Airplanes', 'Moves Like Jagger'],
};

function Profile(props) {
  const { id } = useParams();

  /* useEffect(() => {
    fetchAllPosts();
  }, []); */

  return (
    <div>
      <div className="profile-banner">
        <h1> {testProfile.name} </h1>
        <h2> {testProfile.followers.length} followers, {testProfile.following.length} following </h2>
        <p> ID: {id} </p>
      </div>
      <div className="highlights">
        Highlights
      </div>
    </div>
  );
}

export default Profile;

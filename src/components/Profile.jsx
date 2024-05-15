import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import createProfileSlice from '../store/profile-slice';

/* const testProfile = {
  name: 'Stephen Wang',
  email: 'swang@secret.io',
  password: '',
  followers: ['User 1', 'User 2'],
  following: ['User 3', 'User 4'],
  highlights: ['Perfect Melody', 'Airplanes', 'Moves Like Jagger'],
}; */

function Profile(props) {
  const { id } = useParams();
  const { profile, fetchProfile } = createProfileSlice();

  useEffect(() => {
    fetchProfile(id);
  }, []);

  return (
    <div>
      <div className="profile-banner">
        <h1> {profile.name} </h1>
        <h2> {profile.followers.length} followers, {profile.following.length} following </h2>
        <p> ID: {id} </p>
      </div>
      <div className="highlights">
        {profile.highlights.map((h) => <p> {h} </p>)}
      </div>
    </div>
  );
}

export default Profile;

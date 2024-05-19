import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useStore from '../store';
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
  const profile = useStore((store) => store.profileSlice.profile);
  const fetchProfile = useStore((store) => store.profileSlice.fetchProfile);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    fetchProfile(id).then(setProfileFetched(true));
  }, []);

  const renderProfile = () => {
    if (profileFetched) {
      return (
        <div>
          <div className="profile-banner">
            <h1> Name: {profile.name} </h1>
            {/* <h2> {profile.followers.length} followers, {profile.following.length} following </h2> */}
            <p> ID: {profile.userID} </p>
          </div>
          <div className="highlights">
            {/* {profile.highlights.map((h) => <p> {h} </p>)} */}
          </div>
        </div>
      );
    }
    return <p> Loading... </p>;
  };

  return (
    <div>
      {renderProfile()}
    </div>
  );
}

export default Profile;

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Text } from '@chakra-ui/react';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import { getUserProfile } from '../utils/spotify-api';
import ProfileHeader from './ProfileHeader';
import OthProfileHeader from './OthProfileHeader';

function Profile(props) {
  const { id } = useParams();
  const { fetchProfile, fetchOtherProfile } = useStore((store) => store.profileSlice);
  const [profileFetched, setProfileFetched] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const update = async () => {
      try {
        await updateToken();
        setTokenUpdated(true);
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    };
    update();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userSpotifyProfile = await getUserProfile();
      setUserProfile(await fetchProfile(userSpotifyProfile.id));
      try {
        if (id === userSpotifyProfile.id) {
          const loadedProfile = await fetchProfile(id);
          setIsOwnProfile(true);
          setProfile(loadedProfile);
        } else {
          setIsOwnProfile(false);
          const otherProfile = await fetchOtherProfile(id);
          setProfile(otherProfile);
        }
        await updateToken();
        setProfileFetched(true);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    if (tokenUpdated) {
      fetchProfileData();
    }
  }, [id, tokenUpdated]);

  const renderProfile = () => {
    if (!profileFetched || !userProfile) return <Text>Loading...</Text>;
    else if (!profile) return <Text>Profile not found</Text>;
    else if (isOwnProfile) return <ProfileHeader profile={profile} />;
    else return <OthProfileHeader profile={profile} userProfile={userProfile} id={id} />;
  };

  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      {renderProfile()}
    </motion.div>
  );
}

export default Profile;

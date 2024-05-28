import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Text } from '@chakra-ui/react';
import useStore from '../store';
import { updateToken } from '../utils/SpotifyAuth';
import ProfileHeader from './user-profile';

function Profile() {
  const { id } = useParams();
  const { initialFetch, currentProfile, fetchOtherProfile } = useStore((store) => store.profileSlice);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const [profile, setProfile] = useState(null);

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
      try {
        if (id === currentProfile.userID) {
          setIsOwnProfile(true);
          setProfile(currentProfile);
        } else {
          setIsOwnProfile(false);
          setProfile(await fetchOtherProfile(id));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    if (tokenUpdated && initialFetch) {
      fetchProfileData();
    }
  }, [id, tokenUpdated, initialFetch, currentProfile, fetchOtherProfile]);

  const renderProfile = () => {
    if (!profile) return <Text>Profile not found</Text>;
    return (
      <ProfileHeader
        isOwnProfile={isOwnProfile}
        profile={profile}
        userProfile={currentProfile}
        id={id}
      />
    );
  };

  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50, damping: 12 }}
    >
      <Box position="absolute" w="100vw" mt={75}>
        {renderProfile()}
      </Box>
    </motion.div>
  );
}

export default Profile;

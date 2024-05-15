import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

const Post = () => {
  return( 
    <Card maxW='md'>
      <CardHeader>
        <Flex spacing='4'>
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Avatar name='Bob Joe' src='https://st3.depositphotos.com/4060975/17707/v/450/depositphotos_177073010-stock-illustration-male-vector-icon.jpg' />

            <Box>
              <Heading size='sm'>Bob Joe</Heading>
              <Text>Musician, Dartmouth</Text>
              <Text>Type (artist, album, song, playlist)</Text>
            </Box>
            
          </Flex>
          <IconButton
            variant='ghost'
            colorScheme='gray'
            aria-label='See menu'
            icon={<BsThreeDotsVertical />}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>
          Check out this new song I've been listening to!
        </Text>
      </CardBody>
      <Image
        objectFit='cover'
        src='https://i.tribune.com.pk/media/images/647803-music-1387469249/647803-music-1387469249.jpg'
        alt='Song'
      />

      <CardFooter
        justify='space-between'
        flexWrap='wrap'
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <Button flex='1' variant='ghost' leftIcon={<BiLike />}>
          Like
        </Button>
        <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
          Comment
        </Button>
        <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
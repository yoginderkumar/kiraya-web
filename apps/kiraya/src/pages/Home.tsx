import { Box, Heading, Inline, Stack, Text } from '@kiraya/kiraya-ui';
import React from 'react';

const DATA = [
  {
    id: 'one',
    title: 'Guitar',
    description: 'Guitar for sale',
    ownerInfo: { id: 'abhishek', name: 'Abhishek' },
    tags: ['guitar', 'music'],
    category: { id: 'music', title: 'Music' },
    metaData: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    viewCount: 14,
    duration: [3, 6, 9, 12],
    availability: false,
    productAssets: [
      'https://i.pinimg.com/1200x/fa/96/6f/fa966f2794f277078e9f0379efdfb1bc.jpg',
    ],
  },
  {
    id: 'two',
    title: 'Guitar',
    description: 'Guitar forknascbjbdihvduvuydwvu sale',
    ownerInfo: { id: 'abhishek', name: 'Abhishek' },
    tags: ['guitar', 'music'],
    category: { id: 'music', title: 'Music' },
    metaData: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    viewCount: 14,
    duration: [3, 6, 9, 12],
    availability: false,
    productAssets: [
      'https://i.pinimg.com/1200x/fa/96/6f/fa966f2794f277078e9f0379efdfb1bc.jpg',
    ],
  },
  {
    id: 'three',
    title: 'Guitar',
    description: 'Guitar forknascbjbdihvduvuydwvu sale',
    ownerInfo: { id: 'abhishek', name: 'Abhishek' },
    tags: ['guitar', 'music'],
    category: { id: 'music', title: 'Music' },
    metaData: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    viewCount: 14,
    duration: [3, 6, 9, 12],
    availability: false,
    productAssets: [
      'https://i.pinimg.com/1200x/fa/96/6f/fa966f2794f277078e9f0379efdfb1bc.jpg',
    ],
  },
  {
    id: 'four',
    title: 'Guitar',
    description: 'Guitar forknascbjbdihvduvuydwvu sale',
    ownerInfo: { id: 'abhishek', name: 'Abhishek' },
    tags: ['guitar', 'music'],
    category: { id: 'music', title: 'Music' },
    metaData: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    viewCount: 14,
    duration: [3, 6, 9, 12],
    availability: false,
    productAssets: [
      'https://i.pinimg.com/1200x/fa/96/6f/fa966f2794f277078e9f0379efdfb1bc.jpg',
    ],
  },
  {
    id: 'five',
    title: 'Guitar',
    description: 'Guitar forknascbjbdihvduvuydwvu jhcguyduyg sale',
    ownerInfo: { id: 'abhishek', name: 'Abhishek' },
    tags: ['guitar', 'music'],
    category: { id: 'music', title: 'Music' },
    metaData: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    viewCount: 14,
    duration: [3, 6, 9, 12],
    availability: false,
    productAssets: [
      'https://i.pinimg.com/1200x/fa/96/6f/fa966f2794f277078e9f0379efdfb1bc.jpg',
    ],
  },
];

export default function Home() {
  return (
    <Box paddingX="12" paddingY="4">
      {DATA.length ? (
        <Stack gap="3">
          <Heading as="h3" fontSize="lg" fontWeight="semibold">
            Popular
          </Heading>
          <Inline as="ul" alignItems="center" gap="6">
            {DATA.map((item) => (
              <Stack
                backgroundColor="gray100"
                rounded="md"
                key={item.id}
                className="h-80 w-60"
              >
                <img
                  src={item.productAssets[0]}
                  alt={item.title}
                  className="rounded-t-md h-[200px]"
                />
                <Stack padding="4">
                  <Text>{item.title}</Text>
                  {item.description}
                </Stack>
              </Stack>
            ))}
          </Inline>
        </Stack>
      ) : null}
    </Box>
  );
}

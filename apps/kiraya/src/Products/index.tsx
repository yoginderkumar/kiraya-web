import {
  BookShelfIcon,
  CancelIcon,
  DecorIcon,
  FurnitureIcon,
  HomeApplianceIcon,
  Icon,
  MusicIcon,
  StorageIcon,
} from '@kiraya/kiraya-ui';
import React from 'react';
import { Categories } from './data';

type CategoryIcons = {
  id: Categories;
  color?: React.ComponentProps<typeof Icon>['color'];
  size?: React.ComponentProps<typeof Icon>['size'];
};

export function iconsForCategories({ id, ...props }: CategoryIcons) {
  switch (id) {
    case 'furniture':
      return <FurnitureIcon {...props} />;
    case 'books':
      return <BookShelfIcon {...props} />;
    case 'homeAppliances':
      return <HomeApplianceIcon {...props} />;
    case 'storage':
      return <StorageIcon {...props} />;
    case 'musicalInstruments':
      return <MusicIcon {...props} />;
    case 'decor':
      return <DecorIcon {...props} />;
    default:
      return <CancelIcon {...props} />;
  }
}

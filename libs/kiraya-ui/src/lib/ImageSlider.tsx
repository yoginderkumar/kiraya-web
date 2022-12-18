import React, { ElementType, ForwardedRef, forwardRef } from 'react';
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from 'react-polymorphic-types';
import Slider from 'react-slick';
import { Box, BoxOwnProps } from './Box';

const DefaultElement = 'div';
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
};

export type SliderOwnProps = Omit<BoxOwnProps, 'display'> & {
  images?: string[];
  children?: React.ReactNode;
};

export type ImageSliderProps<
  T extends React.ElementType = typeof DefaultElement
> = PolymorphicPropsWithRef<SliderOwnProps, T>;

export const ImageSlider: PolymorphicForwardRefExoticComponent<
  SliderOwnProps,
  typeof DefaultElement
> = forwardRef(function Stack<T extends ElementType = typeof DefaultElement>(
  { as, images, ...restProps }: PolymorphicPropsWithoutRef<SliderOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: ElementType = as || DefaultElement;
  const defaultSize = restProps.size || '12';
  const defaultColor = restProps.color || 'blue900';
  const defaultBgColor = restProps.backgroundColor || 'blue100';
  return (
    <Element {...restProps}>
      <Box {...restProps}>
        <Slider {...settings} lazyLoad="progressive" slidesToScroll={1}>
          {images?.length
            ? images.map((image, index) => (
                <Box key={image}>
                  <img src={image} alt={`image_${index}`} />
                </Box>
              ))
            : restProps.children
            ? restProps.children
            : null}
        </Slider>
      </Box>
    </Element>
  );
});

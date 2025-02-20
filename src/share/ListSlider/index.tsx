import { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Slider.module.scss';
import RestaurantCard from '@/share/RestaurantCard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getSlider } from '@/services/sliderServices';
import { IconChevronCompactLeft, IconChevronCompactRight } from '@tabler/icons-react';

export interface SliderArrowProps {
  className?: string;
  style?: object;
  onClick?: () => void;
  customClass?: string;
}

function NextArrow(props: SliderArrowProps) {
  const { className, style, onClick, customClass } = props;

  return (
    <div className={`${className} ${customClass}`} style={{ ...style, display: 'block' }} onClick={onClick}>
      <IconChevronCompactRight color="var(--primary-bg)" size={30} />
    </div>
  );
}

function PrevArrow(props: SliderArrowProps) {
  const { className, style, onClick, customClass } = props;

  return (
    <div className={`${className} ${customClass}`} style={{ ...style, display: 'block' }} onClick={onClick}>
      <IconChevronCompactLeft color="var(--primary-bg)" size={30} />
    </div>
  );
}

function ListSlider() {
  const dispatch = useAppDispatch();
  const reduxData = useAppSelector((state) => state.slider);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    arrow: false,
    className: clsx(styles['list-slider']),
    nextArrow: <NextArrow customClass={clsx(styles['next-arrow'])} />,
    prevArrow: <PrevArrow customClass={clsx(styles['prev-arrow'])} />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          nextArrow: <></>,
          prevArrow: <></>,
        },
      },
    ],
  };

  const [data, setData] = useState([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (reduxData.listSlider?.length > 0) {
      setHasData(true);
      setData(reduxData.listSlider);
    } else {
      dispatch(getSlider({ limit: 6, page: 1 })).then((result) => {
        if (result.payload?.code === 200) {
          setData(result.payload?.data?.shops);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx(styles['list-promo'])}>
      {data.length > 0 && (
        <div className={clsx(!hasData && styles['list-wrapper'])}>
          <Slider {...settings}>
            {data.length > 0 &&
              data.map((item, index) => {
                return (
                  <div key={index} className={clsx(styles['item'])}>
                    <RestaurantCard data={item} />
                  </div>
                );
              })}
          </Slider>
        </div>
      )}
    </div>
  );
}

export default memo(ListSlider);

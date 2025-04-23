'use client';
import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconBrandSlack, IconMessage, IconMinus, IconPlus, IconTag } from '@tabler/icons-react';

import { statusData } from './constant';
import styles from './Product.module.scss';
import Button from '@/share/Button';
import LoadingStart from '@/share/Loading';
import { useRouter } from '@/i18n/routing';
import Breadcrumb from '@/share/Breadcrumb';
import { getVNCurrency } from '@/utils/constants';
import { showToast, ToastType } from '@/utils/toastUtils';
import useSessionStorage from '@/hooks/useSessionStorage';
import { getLocalStorageItem } from '@/utils/localStorage';
import { addProductToCart } from '@/services/cartServices';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getRestaurantDetail } from '@/services/restaurantServices';
import { CategoryInfo, ProductInfo, RestaurantInfo } from '@/types';
import { useChatMessageContext } from '@/contexts/ChatMessageProvider';

interface DataInfo {
  name?: string;
  slug?: string;
}

function ProductDetail() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setItem } = useSessionStorage();
  const { addConversation, openMessageModal } = useChatMessageContext();

  const isLoading = useAppSelector((state) => state.restaurant.loading);
  const isAddProduct = useAppSelector((state) => state.cart.loading);
  const [classifies, setClassifies] = useState<string[] | undefined>([]);
  const [shopData, setShopData] = useState<RestaurantInfo>({} as RestaurantInfo);
  const [dataProduct, setDataProduct] = useState<ProductInfo>({} as ProductInfo);
  const [dataInfo, setDataInfo] = useState<{ productInfo: DataInfo; restaurantInfo: DataInfo }>({
    productInfo: {},
    restaurantInfo: {},
  });
  const [classify, setClassify] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlusQuantity = () => {
    if (quantity === 10) {
      showToast(t('quantity-drawer.toast.invalid-quantity'), ToastType.INFO);
      return;
    }
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (getLocalStorageItem('user')) {
      const addToCartPromise = dispatch(addProductToCart({ product: dataProduct?._id, quantity: quantity, classify }))
        .then((result) => {
          if (result?.payload?.code === 200) {
            setQuantity(1);
            setClassify(classifies?.[0] ?? '');
            return result?.payload?.message;
          } else {
            throw new Error(result?.payload?.message || t('system.error'));
          }
        })
        .catch((err) => {
          throw new Error(err?.message || t('system.error'));
        });
      showToast('', ToastType.PROMISE, addToCartPromise);
    } else {
      showToast(t('quantity-drawer.toast.unauthorized'), ToastType.INFO);
    }
  };

  const handleSeeShop = () => {
    const restaurantSelected = sessionStorage.getItem('restaurantSelected')
      ? JSON.parse(String(sessionStorage.getItem('restaurantSelected')))
      : null;
    const restaurantIDSelected = sessionStorage.getItem('restaurantIDSelected')
      ? JSON.parse(String(sessionStorage.getItem('restaurantIDSelected')))
      : null;

    if (restaurantSelected) {
      if (restaurantSelected.slug) {
        router.push(`/restaurants/${restaurantSelected.slug}`);
      }
      if (restaurantIDSelected !== shopData._id) {
        setItem('restaurantIDSelected', shopData._id || null);
      }
      if (restaurantSelected.name !== shopData.fullname || restaurantSelected.slug !== shopData.slug) {
        setItem('restaurantSelected', { name: shopData.fullname, slug: shopData.slug });
      }
    }
  };

  const handleOpenChatModal = async () => {
    const user = await JSON.parse(String(localStorage.getItem('user')));
    if (!user) {
      showToast(t('errors.err12'), ToastType.WARNING);
      return router.push('/auth/signin');
    }
    addConversation(shopData);
    openMessageModal();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const restaurantId = JSON.parse(String(sessionStorage.getItem('restaurantIDSelected')));
    dispatch(getRestaurantDetail(restaurantId)).then((result) => {
      if (result.payload.code === 200) {
        setShopData(result.payload?.data?.shop);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const productIDSelected = JSON.parse(String(sessionStorage.getItem('productIDSelected')));
    if (shopData && shopData.categories) {
      shopData.categories.map((category: CategoryInfo) =>
        category?.products?.map((product: ProductInfo) => {
          if (product._id === productIDSelected) {
            setDataProduct(product);
            setClassifies(product?.classifies);
          }
          return product;
        }),
      );
    }
  }, [shopData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProduct = sessionStorage.getItem('productSelected');
      const storedRestaurant = sessionStorage.getItem('restaurantSelected');
      setDataInfo((preState) => ({
        ...preState,
        productInfo: storedProduct ? JSON.parse(storedProduct) : {},
        restaurantInfo: storedRestaurant ? JSON.parse(storedRestaurant) : {},
      }));
    }
  }, []);

  return (
    <>
      <div className={clsx(styles['bread-crumb'])}>
        <div className={clsx('container gx-5')}>
          <Breadcrumb
            listData={[
              { title: t('restaurant.heading01'), href: '/restaurants' },
              {
                title: String(dataInfo.restaurantInfo?.name),
                href: `/restaurants/${String(dataInfo.restaurantInfo?.slug)}`,
              },
              { title: String(dataInfo.productInfo?.name) },
            ]}
          />
        </div>
      </div>
      <div className={clsx(styles['product-detail'])}>
        <div className={clsx('container gx-5')}>
          <div className={clsx(styles['product-detail__container'])}>
            <div className={clsx('row')}>
              <div className={clsx('col-12 col-xxl-5 col-xl-5 col-lg-6 col-md-12')}>
                <div className={clsx(styles['preview'])}>
                  <div className={clsx(styles['preview__item'])}>
                    <div className={clsx(styles['preview__item-wrap'])}>
                      <Image
                        width={450}
                        height={450}
                        priority
                        src={dataProduct?.image || '/images/default-img.png'}
                        className={clsx(styles['preview__item-img'])}
                        alt={dataProduct?.name || 'Preview Product'}
                      />
                    </div>
                  </div>
                  <div className={clsx(styles['preview__list'])}></div>
                </div>
              </div>
              <div className={clsx('col-12 col-xxl-7 col-xl-7 col-lg-6 col-md-12')}>
                <div className={clsx(styles['product-detail__info'])}>
                  <h1 className={clsx(styles['product-detail__heading'])}>{dataProduct?.name}</h1>

                  <div className={clsx('row')}>
                    <div className={clsx('col-12 col-xxl-5 col-xl-6 col-lg-12 col-md-12')}>
                      <div className={clsx(styles['product-detail__filter'])}>
                        <h4 className={clsx(styles['filter__title'])}>{t('productDetail.title01')}</h4>
                        <div className={clsx(styles['filter__wrapper'])}>
                          {classifies?.map((classifyOption, index) => (
                            <div
                              onClick={() => setClassify(classifyOption)}
                              className={clsx(
                                styles['filter__weight'],
                                classifyOption === classify && styles['filter__weight--active'],
                              )}
                              key={index}
                            >
                              {classifyOption}
                            </div>
                          ))}
                          {classifies?.length === 0 && (
                            <p className={clsx(styles['filter__empty'])}>{t('checkout.desc08')}</p>
                          )}
                        </div>

                        <h4 className={clsx(styles['filter__title'])}>{t('productDetail.title02')}</h4>
                        <div className={clsx(styles['filter__wrapper'])}>
                          <Button onClick={handleMinusQuantity} action outline leftIcon={<IconMinus />}></Button>
                          <span className={clsx(styles['filter__quantity'])}>{quantity}</span>
                          <Button onClick={handlePlusQuantity} action outline leftIcon={<IconPlus />}></Button>
                        </div>
                      </div>
                    </div>
                    <div className={clsx('col-12 col-xxl-7 col-xl-6 col-lg-12 col-md-12')}>
                      {statusData(shopData?.fullname).map(({ Icon, title, desc, descClass }, index) => (
                        <div key={index} className={clsx(styles['filter__wrapper'])}>
                          <div className={clsx(styles['product-detail__status'])}>
                            {<Icon />}
                            <div className={clsx(styles['product-detail__status-info'])}>
                              <span className={clsx(styles['product-detail__status-title'])}>{t(title)}</span>
                              <span className={clsx(styles['product-detail__status-desc'], styles[descClass])}>
                                {t(desc)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className={clsx(styles['filter__wrapper'])}>
                        <div className={clsx(styles['product-detail__price-wrapper'])}>
                          <div className={clsx(styles['product-detail__price-info'])}>
                            <IconTag />
                            <span className={clsx(styles['product-detail__price-only'])}>
                              {getVNCurrency(dataProduct?.price)}
                            </span>
                          </div>
                          <span className={clsx(styles['product-detail__price-total'])}>
                            {getVNCurrency(dataProduct?.price * quantity)}
                          </span>
                          <Button order primary onClick={handleAddToCart}>
                            {t('quantity-drawer.add-to-cart')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={clsx('row mt-5')}>
              <div className={clsx(styles['shop'])}>
                <Image
                  width={480}
                  height={270}
                  priority
                  src={shopData?.avatar || '/images/logo.png'}
                  className={clsx(styles['shop__avatar'])}
                  alt={shopData?.fullname || 'Shop Avatar'}
                />
                <div className={clsx(styles['shop__info'])}>
                  <h4 className={clsx(styles['shop__name'])}>{shopData?.fullname}</h4>
                  <div className={clsx(styles['shop__action'])}>
                    <Button onClick={handleOpenChatModal} leftIcon={<IconMessage size={22} />} shopAction primary>
                      {t('button.btn21')}
                    </Button>
                    <Button onClick={handleSeeShop} leftIcon={<IconBrandSlack size={22} />} shopAction outline primary>
                      {t('button.btn22')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={clsx('row mt-5')}>
              <div className={clsx('col-12 col-xxl-10 col-xl-10 col-lg-10 col-md-12')}>
                <div className={clsx(styles['product-detail__desc'])}>
                  <h4>{t('productDetail.title04')}</h4>
                  <p>{dataProduct?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(isLoading || isAddProduct) && <LoadingStart />}
    </>
  );
}

export default ProductDetail;

/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { CheckIcon, ComboboxItem, Divider, Flex, Radio } from '@mantine/core';
import { IconInfoCircle, IconMap2, IconNote } from '@tabler/icons-react';

import styles from './Checkout.module.scss';
import validationSchema from './schema';
import Button from '@/share/Button';
import CartItem from '@/share/CartItem';
import InputText from '@/share/InputText';
import LoadingStart from '@/share/Loading';
import { Link, useRouter } from '@/i18n/routing';
import { getVNCurrency, getVNDate } from '@/utils/constants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import useSessionStorage from '@/hooks/useSessionStorage';
import { showToast, ToastType } from '@/utils/toastUtils';
import { createOrder } from '@/services/ordersServices';
import { savePayment } from '@/lib/features/paymentSlice';
import SelectBox, { ItemInfo } from '@/share/SelectBox';
import { AddressItemInfo, CartItemInfo, CheckoutCartsData, GHNServicesProps, RestaurantInfo } from '@/types';
import { getCities, getDistricts, getWards, getAvailableServices, gHNExpressFee } from '@/services/ghnExpressServices';

export interface CheckoutFormValue {
  addressDetail: string;
  note: string;
}

function CheckOut() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setItem } = useSessionStorage();

  const isLoading = useAppSelector((state) => state.orders.loading);
  const expressLoadings = useAppSelector((state) => state.ghn);
  const checkoutCartsData = useAppSelector((state) => state.checkoutCarts.selectedShops);

  const [listCartProduct, setListCartProduct] = useState<CheckoutCartsData[]>([]);
  const [totalCartCheckout, setTotalCartCheckout] = useState(0);
  const [totalShipFee, setTotalShipFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const cartsLength = checkoutCartsData ? checkoutCartsData.length : 0;

  const [cities, setCities] = useState<ItemInfo[]>([]);
  const [cityDistricts, setCityDistricts] = useState<ItemInfo[]>([]);
  const [districtWards, setDistrictWards] = useState<ItemInfo[]>([]);
  const [provinceID, setProvinceID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [wardID, setWardID] = useState<string>('');
  const [availableServices, setAvailableServices] = useState(0);
  const [previousWard, setPreviousWard] = useState<string>('');
  const [isTotalLoading, setIsTotalLoading] = useState(false);

  // Shopping cart information - start
  const [city, setCity] = useState<ComboboxItem | null>(null);
  const [district, setDistrict] = useState<ComboboxItem | null>(null);
  const [ward, setWard] = useState<ComboboxItem | null>(null);
  const [payment, setPayment] = useState<string>('cod');
  const [listProduct, setListProduct] = useState<string[]>([]);
  // - end

  const [isSelectCity, setIsSelectCity] = useState(false);
  const [isSelectDistrict, setIsSelectDistrict] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleCityClick = (cityItem: ComboboxItem) => {
    setCity(cityItem);
    setProvinceID(Number(cityItem?.value));
  };

  const handleDistrictClick = (districtItem: ComboboxItem | null) => {
    setDistrict(districtItem);
    setDistrictID(Number(districtItem?.value));
  };

  const handleWardClick = (wardItem: ComboboxItem | null) => {
    setWard(wardItem);
    setWardID(`${wardItem ? wardItem.value : ''}`);
  };

  const handleGetTheListOfCities = () => {
    dispatch(getCities()).then((result) => {
      if (result.payload?.code === 200) {
        const citiesArray = Object.values(result.payload.data) as AddressItemInfo[];
        const formattedCities = citiesArray
          .map((city) => ({
            label: city.NameExtension?.[1] ?? '',
            value: city.ProvinceID ?? 0,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCities(formattedCities);
      } else {
        showToast(result.payload?.message, ToastType.WARNING);
      }
    });
  };

  const handleGetTheListOfDistricts = () => {
    dispatch(getDistricts({ provinceID })).then((result) => {
      if (result.payload?.code === 200) {
        const districtsArray = Object.values(result.payload.data) as AddressItemInfo[];
        const formattedDistricts = districtsArray.map((district) => ({
          label: district.NameExtension?.[1] ?? '',
          value: district.DistrictID ?? 0,
        }));
        setCityDistricts(formattedDistricts);
      } else {
        showToast(result.payload?.message, ToastType.WARNING);
      }
    });
  };

  const handleGetTheListOfWards = () => {
    dispatch(getWards({ districtID })).then((result) => {
      if (result.payload?.code === 200) {
        const wardsArray = Object.values(result.payload.data) as AddressItemInfo[];
        const formattedWards = wardsArray.map((ward) => ({
          label: ward.NameExtension?.[1] ?? '',
          value: ward.WardCode ?? '',
        }));
        setDistrictWards(formattedWards);
      } else {
        showToast(result.payload?.message, ToastType.WARNING);
      }
    });
  };

  const handleGetAvailableServices = () => {
    dispatch(getAvailableServices({ fromDistrict: 1804, toDistrict: districtID })).then((result) => {
      if (result.payload?.code === 200) {
        setAvailableServices(result.payload?.data?.[0].service_id);
      } else {
        showToast(result.payload?.message, ToastType.WARNING);
      }
    });
  };

  const handleChargeShippingFee = ({
    serviceID,
    price,
    from_district_id,
    to_district_id,
    to_ward_code,
    height,
    length,
    weight,
    width,
  }: GHNServicesProps) => {
    if (ward) {
      dispatch(
        gHNExpressFee({
          serviceID,
          price,
          from_district_id,
          to_district_id,
          to_ward_code,
          height,
          length,
          weight,
          width,
        }),
      ).then((result) => {
        if (result.payload?.code === 200) {
          setTotalShipFee((prevState) => prevState + result.payload.data?.total);
        } else {
          showToast(result.payload?.message, ToastType.WARNING);
        }
      });
    }
  };

  const handleOrder = (values: CheckoutFormValue) => {
    const editedAddress = !ward
      ? [values.addressDetail, district?.label, city?.label].join(', ')
      : [values.addressDetail, ward?.label, district?.label, city?.label].join(', ');

    dispatch(
      createOrder({
        cartDetails: listProduct,
        paymentMethod: payment,
        address: editedAddress,
        note: values.note,
      }),
    ).then((result) => {
      if (result.payload.code === 201) {
        setIsSubmit(false);
        setListCartProduct([]);
        setTotalCartCheckout(0);
        setCity(null);
        setDistrict(null);
        setWard(null);
        showToast(result.payload?.message, ToastType.SUCCESS);
        if (payment === 'cod' || payment === 'prepaid') {
          setTimeout(() => {
            router.push('/auth/profile');
            showToast(t('checkout.notify04'), ToastType.INFO);
          }, 4000);
        }
        if (payment === 'bank') {
          dispatch(
            savePayment({
              qr: result.payload.data.urlQRCode,
              total: result.payload.data.totalMoneyOrder,
            }),
          );
          setTimeout(() => {
            router.push('/payment');
            showToast(t('checkout.notify05'), ToastType.INFO);
          }, 3000);
        }
      } else {
        showToast(result.payload?.message, ToastType.WARNING);
      }
    });
  };

  const handleDeliveryTime = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return getVNDate(deliveryDate);
  };

  const handleClickShopName = (restaurantItem: RestaurantInfo) => {
    setItem('restaurantIDSelected', restaurantItem._id);
    setItem('restaurantSelected', { name: restaurantItem?.fullname, slug: restaurantItem?.slug });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lấy danh sách thành phố
  useEffect(() => {
    handleGetTheListOfCities();
  }, []);

  // Lấy danh sách huyện
  useEffect(() => {
    if (!provinceID) return;
    handleGetTheListOfDistricts();
  }, [provinceID]);

  // Lấy danh sách xã
  useEffect(() => {
    if (!districtID) return;
    handleGetTheListOfWards();
    handleGetAvailableServices();
  }, [districtID]);

  useEffect(() => {
    if (ward) setPreviousWard(ward.label);
  }, [ward]);

  useEffect(() => {
    if (districtID === 0 || wardID === '' || previousWard !== ward?.label) setTotalShipFee(0);
  }, [districtID, wardID, previousWard, ward]);

  // Tính tiền ship
  useEffect(() => {
    if (wardID === '') return;
    if (previousWard !== '' && previousWard === ward?.label) return;
    if (listCartProduct) {
      listCartProduct.map((cartItem) =>
        handleChargeShippingFee({
          serviceID: availableServices,
          price: cartItem.totalMoney,
          from_district_id: 1804,
          to_district_id: districtID,
          to_ward_code: wardID,
          height: 15,
          length: 15,
          weight: 1000,
          width: 15,
        }),
      );
    }
  }, [wardID]);

  useEffect(() => {
    if (districtWards?.length === 0 && !district) {
      setWard(null);
    }
  }, [districtWards]);

  useEffect(() => {
    if (!city) {
      handleDistrictClick(null);
      setIsSelectCity(true);
    } else {
      setIsSelectCity(false);
    }
  }, [city]);

  useEffect(() => {
    if (!district) {
      handleWardClick(null);
      setIsSelectDistrict(true);
    } else {
      setIsSelectDistrict(false);
    }
  }, [district]);

  useEffect(() => {
    if (city && district && ward) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [city, district, ward]);

  useEffect(() => {
    if (checkoutCartsData) {
      const productIds: string[] = [];

      setListCartProduct(checkoutCartsData);

      checkoutCartsData.forEach((cartItem: CheckoutCartsData) => {
        setTotalCartCheckout((prevState) => prevState + cartItem.totalMoney);
        cartItem.selectedProducts.forEach((cartItemDetail) => {
          const productId = cartItemDetail._id;
          productIds.push(productId);
        });
      });
      setListProduct(productIds);

      if (checkoutCartsData?.length === 0) {
        showToast(t('checkout.notify03'), ToastType.WARNING);
      }
    }

    return () => setTotalCartCheckout(0);
  }, [checkoutCartsData]);

  useEffect(() => {
    setIsTotalLoading(true);
    const time = setTimeout(() => {
      setTotalFee(totalCartCheckout + totalShipFee);
      setIsTotalLoading(false);
    }, 1000);

    return () => clearTimeout(time);
  }, [totalCartCheckout, totalShipFee]);

  return (
    <Formik
      initialValues={{ addressDetail: '', note: t('checkout.desc01') }}
      validationSchema={validationSchema(t)}
      onSubmit={(values: CheckoutFormValue) => {
        handleOrder(values);
      }}
      validateOnChange={true}
      validateOnMount={true}
    >
      {({ isValid, dirty }) => {
        return (
          <Form>
            <div className={clsx(styles['checkout'])}>
              {cartsLength > 0 && (
                <>
                  <div className={clsx(styles['checkout__top'])}>
                    <div className={clsx('container gx-5')}>
                      <div className={clsx(styles['checkout__info'])}>
                        <div>
                          <h1 className={clsx(styles['checkout__heading'])}>{t('checkout.heading')}</h1>
                          <h4 className={clsx(styles['checkout__name'])}>
                            {listCartProduct
                              ? listCartProduct.map((cartItem, index) => {
                                  if (index === listCartProduct?.length - 1) {
                                    return <p key={index}>{cartItem?.shop?.fullname}</p>;
                                  }
                                  return <p key={index}>{`${cartItem?.shop?.fullname}, `}</p>;
                                })
                              : ' '}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={clsx('container gx-5')}>
                    <div className={clsx('row gx-4 gx-xxl-5')}>
                      <div className={clsx('col-12 col-xxl-8 col-xl-8 col-lg-8 col-md-12')}>
                        <div className={clsx(styles['checkout__group'])}>
                          <h4 className={clsx(styles['checkout__group-title'])}>{t('checkout.title01')}</h4>
                          <Divider my="md" variant="dashed" />

                          <div className={clsx(styles['delivery-time'])}>
                            <div className={clsx(styles['delivery-time__info'])}>
                              <span className={clsx(styles['delivery-time__title'])}>{t('checkout.title02')}</span>
                              <span className={clsx(styles['delivery-time__value'])}>
                                {t('checkout.desc09')}
                                {`${t('cart.desc05')} ${handleDeliveryTime()}`}
                              </span>
                            </div>
                            <Image
                              width={850}
                              height={280}
                              priority
                              className={clsx(styles['delivery-time__img'])}
                              src={'/images/checkout/ghn.png'}
                              alt="GHN Logo"
                            />
                          </div>
                          <Divider my="md" variant="dashed" />

                          <div className={clsx(styles['address'])}>
                            <span className={clsx(styles['address__title'])}>{t('checkout.title03')}</span>
                            <div className={clsx(styles['address__group'], styles['address__group--three'])}>
                              {/* Cities */}
                              <SelectBox
                                required
                                data={cities}
                                value={city}
                                onChange={handleCityClick}
                                label={t('checkout.title04')}
                              />
                              {/* Districts */}
                              <SelectBox
                                required
                                disabled={!city}
                                data={cityDistricts}
                                label={t('checkout.title05')}
                                onChange={handleDistrictClick}
                                value={!isSelectCity ? district : null}
                              />
                              {/* Wards */}
                              <SelectBox
                                required
                                data={districtWards}
                                onChange={handleWardClick}
                                disabled={!city || !district}
                                label={t('checkout.title06')}
                                value={!isSelectDistrict ? ward : null}
                              />
                            </div>

                            {/* Address detail */}
                            <InputText
                              required
                              label={t('checkout.title14')}
                              name="addressDetail"
                              type="text"
                              placeholder={t('checkout.desc07')}
                              LeftIcon={<IconMap2 />}
                              readOnly={isLoading}
                              className={clsx(styles['address__input'])}
                            />

                            {/* Note */}
                            <InputText
                              label={t('checkout.title07')}
                              name="note"
                              type="text"
                              placeholder={t('checkout.desc01')}
                              LeftIcon={<IconNote />}
                              readOnly={isLoading}
                              className={clsx(styles['address__input'])}
                            />
                          </div>
                        </div>

                        {/* Products list */}
                        <div className={clsx(styles['checkout__group'])}>
                          <h4 className={clsx(styles['checkout__group-title'])}>{t('checkout.title08')}</h4>
                          <Divider my="md" variant="dashed" />

                          <div className={clsx(styles['checkout__carts'])}>
                            {listCartProduct &&
                              listCartProduct.map((cartItem, index) => {
                                return (
                                  <div key={index} className={clsx(styles['cart__products'])}>
                                    <div className={clsx(styles['cart__products-top'])}>
                                      <Link
                                        href={`/restaurants/${cartItem.shop.slug}`}
                                        onClick={() => handleClickShopName(cartItem.shop)}
                                      >
                                        <h5 className={clsx(styles['cart__products-heading'])}>
                                          {cartItem.shop.fullname}
                                        </h5>
                                      </Link>
                                    </div>
                                    <div className={clsx(styles['cart__products-list'])}>
                                      {cartItem.selectedProducts.map((cartDetail: CartItemInfo, index: number) => (
                                        <CartItem
                                          key={index}
                                          data={cartDetail}
                                          isCheckout
                                          selectedProductsNumber={cartItem.selectedProducts?.length}
                                          toRight
                                        />
                                      ))}
                                    </div>
                                    <div className={clsx(styles['cart__summary'])}>
                                      <div className={clsx(styles['cart__summary-info'])}>
                                        <span className={clsx(styles['cart__summary-price'])}>{t('cart.desc03')}</span>
                                        <span className={clsx(styles['cart__summary-price'])}>
                                          {getVNCurrency(cartItem?.totalMoney)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          <div className={clsx(styles['checkout__total'])}>
                            <div className={clsx(styles['checkout__total-group'])}>
                              <h6 className={clsx(styles['checkout__total-title'])}>{t('checkout.title09')}</h6>
                              <h6 className={clsx(styles['checkout__total-value'])}>
                                {getVNCurrency(totalCartCheckout)}
                              </h6>
                            </div>
                            <div className={clsx(styles['checkout__total-group'])}>
                              <h6 className={clsx(styles['checkout__total-title'])}>
                                {t('checkout.title12')} <IconInfoCircle size={20} />
                              </h6>
                              <h6 className={clsx(styles['checkout__total-value'])}>{getVNCurrency(totalShipFee)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={clsx('col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-12')}>
                        {/* Payment detail */}
                        <div className={clsx(styles['checkout__group'])}>
                          <h4 className={clsx(styles['checkout__group-title'])}>{t('checkout.title10')}</h4>
                          <Divider my="md" variant="dashed" />
                          <div className={clsx(styles['checkout__payment'])}>
                            <div className={clsx(styles['checkout__payment-group'])}>
                              <Radio.Group
                                size="xl"
                                required
                                value={payment}
                                onChange={setPayment}
                                name="payment-method"
                                label={t('checkout.title11')}
                              >
                                <Flex direction="column" gap="md" mt="md">
                                  <Radio
                                    value="cod"
                                    icon={CheckIcon}
                                    variant="outline"
                                    size="lg"
                                    color="var(--primary-bg)"
                                    label={t('checkout.desc02')}
                                    checked
                                  />
                                  <Radio
                                    value="bank"
                                    icon={CheckIcon}
                                    variant="outline"
                                    size="lg"
                                    color="var(--primary-bg)"
                                    label={t('checkout.desc03')}
                                  />
                                  <Radio
                                    value="prepaid"
                                    icon={CheckIcon}
                                    variant="outline"
                                    size="lg"
                                    color="var(--primary-bg)"
                                    label={t('checkout.desc04')}
                                  />
                                </Flex>
                              </Radio.Group>
                            </div>
                          </div>
                        </div>

                        <div className={clsx(styles['checkout__right'])}>
                          <div className={clsx(styles['checkout__right-info'])}>
                            <h4 className={clsx(styles['checkout__right-title'])}>{t('cart.desc03')}</h4>
                            <span className={clsx(styles['checkout__right-cost'])}>{getVNCurrency(totalFee)}</span>
                          </div>
                          <Button
                            type="submit"
                            order
                            primary
                            disabled={!isSubmit || !isValid || !dirty || listCartProduct?.length === 0}
                          >
                            {t('button.btn16')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {cartsLength <= 0 && (
                <div className={clsx(styles['no-products'])}>
                  <Image
                    width={250}
                    height={250}
                    priority
                    src={'/images/cart.svg'}
                    alt="Cart Empty"
                    className={clsx(styles['no-products__thumb'])}
                  />
                  <div className={clsx(styles['no-products__info'])}>
                    <h4 className={clsx(styles['no-products__title'])}>{t('checkout.title13')}</h4>
                    <p className={clsx(styles['no-products__desc'])}>{t('checkout.desc06')}</p>
                    <Link href={'/restaurants'} className={clsx(styles['no-products__link'])}>
                      {t('checkout.link01')}
                    </Link>
                  </div>
                </div>
              )}

              {(isLoading || expressLoadings.shippingFeeLoading || isTotalLoading) && <LoadingStart />}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default CheckOut;

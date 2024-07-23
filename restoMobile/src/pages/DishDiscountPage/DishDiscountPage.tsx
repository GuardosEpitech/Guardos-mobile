import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styles from './DishDiscountPage.styles';
import { addDiscount, removeDiscount } from '../../services/dishCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IDishFE } from '../../../../shared/models/dishInterfaces';
import { useTranslation } from "react-i18next";

type RootStackParamList = {
  'Manage Discount': { dish: IDishFE };
};

type DishDiscountPageRouteProp = RouteProp<RootStackParamList, 'Manage Discount'>;

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const DishDiscountPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DishDiscountPageRouteProp>();
  const { dish } = route.params;

  const [mode, setMode] = useState<'percentage' | 'price'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originalPrice] = useState(dish.price);
  const { t } = useTranslation();

  useEffect(() => {
    if (dish.discount !== undefined && dish.discount !== -1 && dish.validTill) {
      const discount = dish.discount;
      if (mode === 'percentage') {
        const discountPercentage = ((discount / originalPrice) * 100).toFixed(2);
        setDiscountValue(discountPercentage);
      } else {
        setDiscountValue(discount.toFixed(2));
      }
      setExpiryDate(parseDate(dish.validTill));
    }
  }, [dish, mode, originalPrice]);

  const handleModeSwitch = () => {
    setMode(prevMode => {
      if (prevMode === 'percentage') {
        if (discountValue) {
          const percentageValue = parseFloat(discountValue);
          if (!isNaN(percentageValue) && percentageValue >= 0 && percentageValue <= 100) {
            const convertedPrice = (percentageValue / 100) * originalPrice;
            setDiscountValue(convertedPrice.toFixed(2));
          }
        }
        return 'price';
      } else {
        if (discountValue) {
          const priceValue = parseFloat(discountValue);
          if (!isNaN(priceValue) && priceValue >= 0 && priceValue <= originalPrice) {
            const convertedPercentage = (priceValue / originalPrice) * 100;
            setDiscountValue(convertedPercentage.toFixed(2));
          }
        }
        return 'percentage';
      }
    });
  };

  const handleSave = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (mode === 'percentage') {
      const percentage = parseFloat(discountValue);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        setError(t('pages.DiscountDishPage.errorPercent'));
        return;
      }
    } else {
      const price = parseFloat(discountValue);
      if (isNaN(price) || price < 0 || price > originalPrice) {
        setError(t('pages.DiscountDishPage.errorPrice'));
        return;
      }
    }

    if (!expiryDate) {
      setError(t('pages.DiscountDishPage.errorDate'));
      return;
    }

    const formattedDate = formatDate(expiryDate);
    const discountAsNumber = mode === 'percentage'
      ? parseFloat(discountValue) / 100 * originalPrice
      : parseFloat(discountValue);

    dish.discount = discountAsNumber;
    dish.validTill = formattedDate;

    await addDiscount({ restoName: dish.resto, dish }, userToken);
    Alert.alert(t('common.success'), t('pages.DiscountDishPage.successAdd'));
    navigation.goBack();
  };

  const handleRemoveDiscount = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    dish.discount = -1;
    dish.validTill = "";
    await removeDiscount({ restoName: dish.resto, dish }, userToken);
    Alert.alert(t('common.success'), t('pages.DiscountDishPage.successDelete'));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>{t('pages.DiscountDishPage.title')}{dish.name}</Text>

        <View style={styles.switchContainer}>
          <Text>{t('pages.DiscountDishPage.switchPercent')}</Text>
          <Switch
            value={mode === 'price'}
            onValueChange={handleModeSwitch}
          />
          <Text>{t('pages.DiscountDishPage.switchPrice')}</Text>
        </View>

        <TextInput
          style={styles.input}
          keyboardType='numeric'
          placeholder={mode === 'price' ? t('pages.DiscountDishPage.price') : t('pages.DiscountDishPage.percent')}
          value={discountValue}
          onChangeText={setDiscountValue}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        {expiryDate && (
          <Text style={styles.expiryDateText}>
            {t('pages.DiscountDishPage.valid')} {expiryDate.toDateString()}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title={t('pages.DiscountDishPage.btnDate')}
          onPress={() => setShowDatePicker(true)}
        />

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setShowDatePicker(false);
            setExpiryDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        <Button
          style={styles.button}
          title={t('pages.DiscountDishPage.btnSave')}
          onPress={handleSave}
        />

        {dish.discount && (
          <Button
            style={styles.button}
            title={t('pages.DiscountDishPage.btnRemove')}
            onPress={handleRemoveDiscount}
          />
        )}
      </View>
    </View>
  );
};

export default DishDiscountPage;

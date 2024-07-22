import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import styles from './DishDiscountPage.styles';
import { addDiscount, removeDiscount } from '../../services/dishCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IDishFE } from '../../../../shared/models/dishInterfaces';

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface IDishDiscountProps {
  dish: IDishFE;
}

const DishDiscountPage: React.FC<IDishDiscountProps> = ({ dish }) => {
  const navigation = useNavigation();

  const [mode, setMode] = useState<'percentage' | 'price'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originalPrice] = useState(dish.price);

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
        setError('Percentage should be between 0 and 100.');
        return;
      }
    } else {
      const price = parseFloat(discountValue);
      if (isNaN(price) || price < 0 || price > originalPrice) {
        setError('Price should be between 0 and the original price.');
        return;
      }
      
    }

    if (!expiryDate) {
      setError('Please select an expiry date.');
      return;
    }

    const formattedDate = formatDate(expiryDate);
    const discountAsNumber = mode === 'percentage'
      ? parseFloat(discountValue) / 100 * originalPrice
      : parseFloat(discountValue);
    
    dish.discount = discountAsNumber;
    dish.validTill = formattedDate;
    
    await addDiscount({ restoName: dish.resto, dish }, userToken);
    Alert.alert('Success', 'Discount saved successfully.');
    navigation.goBack();
  };

  const handleRemoveDiscount = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    dish.discount = -1;
    dish.validTill = "";
    await removeDiscount({ restoName: dish.resto, dish }, userToken);
    Alert.alert('Success', 'Discount removed successfully.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage discount of {dish.name}</Text>

      <View style={styles.switchContainer}>
        <Text>Percentage</Text>
        <Switch
          value={mode === 'price'}
          onValueChange={handleModeSwitch}
        />
        <Text>Price</Text>
      </View>

      <TextInput
        style={styles.input}
        keyboardType='numeric'
        placeholder={`Enter ${mode}`}
        value={discountValue}
        onChangeText={setDiscountValue}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title="Select Expiry Date"
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DatePicker
          modal
          mode="date"
          open={showDatePicker}
          date={expiryDate || new Date()}
          minimumDate={new Date()}
          onConfirm={(date) => {
            setShowDatePicker(false);
            setExpiryDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}

      <Button
        title="Save Discount"
        onPress={handleSave}
      />

      {discountValue && (
        <Button
          title="Remove Discount"
          onPress={handleRemoveDiscount}
        />
      )}
    </View>
  );
};

export default DishDiscountPage;

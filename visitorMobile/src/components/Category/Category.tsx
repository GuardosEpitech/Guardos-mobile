import React from 'react';
import { View, Text } from 'react-native';
import styles from './Category.styles';

const Category = ({ title, children }) => {
  return (
    <View style={styles.categoryBox}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

export default Category;

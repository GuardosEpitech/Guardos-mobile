import React, { useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Accordion.styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const Accordion = ({ title, children }) => {
  const [ expanded, setExpanded ] = useState(false);

  function toggleItem() {
    setExpanded(!expanded);
  }
  const body = <View>{ children }</View>;

  return (
    <>
      {React.Children.count(children) > 0 && (
        <View style={styles.accordion}>
          <TouchableOpacity onPress={toggleItem} style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Icon
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#bbb"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          {expanded && body}
        </View>
      )}
    </>


  );
};



export default Accordion;

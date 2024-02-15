import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './AboutUs.styles';

import introduction from './text/Introduction';
import foundingStory from './text/FoundingStory';
import teamDescription from './text/TeamDescription';
import { 
  empowerment, 
  transparency, 
  improvement 
} from './text/MissionAndValues';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      photo: require('../../../assets/profile/josi.png'),
      description: '4th year Epitech student from Germany',
    },
    {
      id: 2,
      photo: require('../../../assets/profile/gylian.png'),
      description: '4th year Epitech student from Germany',
    },
    {
        id: 3,
        photo: require('../../../assets/profile/mark.png'),
        description: '4th year Epitech student from Germany',
      },
      {
        id: 4,
        photo: require('../../../assets/profile/ramon.png'),
        description: '4th year Epitech student from Germany',
      },
      {
        id: 5,
        photo: require('../../../assets/profile/renan.png'),
        description: '4th year Epitech student from France',
      },
      {
        id: 6,
        photo: require('../../../assets/profile/alban.png'),
        description: '4th year Epitech student from France',
      },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>Introduction</Text>
        <Text style={styles.centerText}>{introduction}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>Founding Story</Text>
        <Text style={styles.centerText}>{foundingStory}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>
          Mission and Values
        </Text>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, styles.centerText]}>
            Empowerment and Inclusivity
          </Text>
          <Text style={styles.centerText}>
            {empowerment}
          </Text>
        </View>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, styles.centerText]}>
            Transparency and Trust
          </Text>
          <Text style={styles.centerText}>
            {transparency}
          </Text>
        </View>
        <View style={styles.value}>
          <Text style={[styles.valueHeading, styles.centerText]}>
            Continuous Improvement and Innovation
          </Text>
          <Text style={styles.centerText}>
            {improvement}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.centerText]}>Team</Text>
        {teamMembers.map(member => (
          <View key={member.id} style={styles.member}>
            <Image source={member.photo} style={styles.photo} />
            <Text style={styles.centerText}>{member.description}</Text>
          </View>
        ))}
        <Text style={styles.centerText}>{teamDescription}</Text>
      </View>
    </ScrollView>
  );
};

export default AboutUs;

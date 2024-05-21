import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import styles from './styles'
import {useTranslation} from "react-i18next";

export type Props = { error: Error; resetError: () => void }

const FallbackComponent = (props: Props) => {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('components.ErrorBoundary.oops')}</Text>
        <Text style={styles.subtitle}>{t('components.ErrorBoundary.error')}</Text>
        <Text style={styles.error}>{props.error.toString()}</Text>
        <TouchableOpacity style={styles.button} onPress={props.resetError}>
          <Text style={styles.buttonText}>{t('components.ErrorBoundary.try-again')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default FallbackComponent

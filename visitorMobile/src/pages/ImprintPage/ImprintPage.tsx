import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './ImprintPage.styles';

const ImprintPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.impressumContainer}>
      <Text style={styles.headline}>{t('pages.Imprint.title')}</Text>
      <Text>{"\n"}</Text>
      <View style={styles.impressumInfo}>
        <Text>{t('pages.Imprint.intro')}</Text>
        <Text>{"\n"}</Text>
        <Text>{t('pages.Imprint.us')}</Text>
        <Text>{t('pages.Imprint.address1')}</Text>
        <Text>{t('pages.Imprint.address2')}</Text>
        <Text>{"\n"}</Text>
        <Text>{t('pages.Imprint.telephone')}</Text>
        <Text>{t('pages.Imprint.email')}</Text>
        <Text>{"\n"}</Text>
        <Text>{t('pages.Imprint.register')}</Text>
        <Text>{t('pages.Imprint.registerNr')}</Text>
        <Text>{"\n"}</Text>
        <Text>{t('pages.Imprint.ust')}</Text>
        <Text>{"\n"}</Text>
        <Text>{t('pages.Imprint.manager')}</Text>
      </View>
      <View style={styles.impressumLegal}>
        <Text style={[styles.headline, styles.legalTitle]}>{t('pages.Imprint.legal')}</Text>
        <Text>{"\n"}</Text>
        <Text>{t('pages.Imprint.introLegal')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.headline, styles.legalTitle]}>{t('pages.Imprint.txtlegal1')}</Text>
        <Text>{"\n"}</Text>
        <Text>
          {t('pages.Imprint.txtlegal2')}{' '}
          <Text style={styles.link}>
            http://ec.europa.eu/consumers/odr
          </Text>{' '}
          {t('pages.Imprint.txtlegal3')}
        </Text>
      </View>
    </View>
  );
};

export default ImprintPage;

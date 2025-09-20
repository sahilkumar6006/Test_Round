import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoDetail'>;

const PhotoDetail: React.FC<Props> = ({ route }) => {
  const { imageUrl } = route.params;
  const width = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={{ width, height: undefined, aspectRatio: 1, resizeMode: 'contain' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoDetail;

import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Button = ({
  title,
  isLoading,
  isDisabled,
  onPress,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
      }}
      onPress={onPress}
      disabled={isLoading || isDisabled}>
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={{color: 'white', fontSize: 18}}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

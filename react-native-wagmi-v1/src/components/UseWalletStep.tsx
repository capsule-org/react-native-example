import {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {capsule} from '../clients/capsule';
import {Button} from './Button';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';

interface UseWalletStepProps {
  onLogout: () => void;
}

const DEFAULT_TO_ADDRESS = '0x42c9a72c9dfcc92cae0de9510160cea2da27af91';
const DEFAULT_CHAIN_ID = '11155111';

export const UseWalletStep = ({onLogout}: UseWalletStepProps) => {
  const {address: walletAddress, isConnected} = useAccount();
  const {connect, connectors, isLoading, pendingConnector} = useConnect();
  const {disconnect} = useDisconnect();

  const {config} = usePrepareSendTransaction({
    to: DEFAULT_TO_ADDRESS,
    value: BigInt(10100000000),
    chainId: Number(DEFAULT_CHAIN_ID),
    type: 'eip1559',
  });

  const {
    data,
    sendTransaction,
    isLoading: isSendTxLoading,
  } = useSendTransaction({
    ...config,
    onSuccess: () => {
      Toast.show({type: 'success', text1: '🔥 TX sent successfully! 🔥'});
    },
    onError: e => {
      console.error('TX Send Error: ', e);
      Toast.show({type: 'error', text1: 'TX sending failed.'});
    },
  });

  const {isSuccess} = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 0,
  });

  const [walletId, setWalletId] = useState('');
  const [email, setEmail] = useState('');
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const fetchAndSetWallet = () => {
    // Get all wallets and set the first ID and address for display
    const allWallets = capsule.getWallets();
    const firstWalletId = Object.keys(allWallets)[0];

    setWalletId(firstWalletId);
  };

  // Get wallet & email
  useEffect(() => {
    fetchAndSetWallet();
    setEmail(capsule.getEmail() ?? '');
  }, []);

  // If for some reason the user still doesn't have a wallet, allow them to create one
  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true);

      await capsule.createWallet(false, () => {});

      Toast.show({
        type: 'success',
        text1: '🔥 Wallet created successfully! 🔥',
      });
      fetchAndSetWallet();
    } catch (e) {
      console.error('Wallet Creation Error: ', e);
      Toast.show({type: 'error', text1: 'Wallet creation failed.'});
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Are you sure you want to logout?',
      undefined,
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Logout',
          onPress: async () => {
            disconnect();
            // Log the user out
            await capsule.logout();

            onLogout();
          },
        },
      ],
      {
        userInterfaceStyle: 'dark',
      },
    );
  };

  const handleSendTx = () => {
    sendTransaction?.();
  };

  return (
    <>
      <View style={{flex: 1, paddingTop: 36}}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            paddingBottom: 16,
          }}>
          Press any field to copy
        </Text>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 16}}>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(email);
            }}>
            <Text style={{color: 'white', fontSize: 16}}>Email:</Text>
            <Text style={{color: 'white', fontSize: 16}}>{email}</Text>
          </TouchableOpacity>
          {isConnected ? (
            <>
              {walletId && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(walletId);
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                      Wallet ID:
                    </Text>
                    <Text style={{color: 'white', fontSize: 16}}>
                      {walletId}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(walletAddress ?? '');
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                      Wallet Address:
                    </Text>
                    <Text style={{color: 'white', fontSize: 16}}>
                      {walletAddress}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <Text
              style={{
                color: 'red',
                fontSize: 16,
                paddingTop: 16,
                textAlign: 'center',
              }}>
              Not Connected
            </Text>
          )}
          {isSuccess && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(data?.hash ?? '');
                }}>
                <Text style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                  TX Hash:
                </Text>
                <Text style={{color: 'white', fontSize: 16}}>{data?.hash}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(
                    `https://sepolia.etherscan.io/tx/${data?.hash}`,
                  );
                }}>
                <Text style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                  Sepolia Scan Link:
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                  }}>{`https://sepolia.etherscan.io/tx/${data?.hash}`}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
        <View style={{justifyContent: 'flex-end', gap: 16}}>
          {!isConnected ? (
            <>
              {connectors.map(conn => (
                <Button
                  title={`Connect To ${conn.name}${
                    !conn.ready ? ' (unsupported)' : ''
                  }`}
                  isDisabled={!conn.ready}
                  isLoading={isLoading && conn.id === pendingConnector?.id}
                  key={conn.id}
                  onPress={() => connect({connector: conn})}
                />
              ))}
            </>
          ) : !walletId ? (
            <Button
              onPress={handleCreateWallet}
              title="Create Wallet"
              isLoading={isCreatingWallet}
            />
          ) : (
            <Button
              onPress={handleSendTx}
              title="Send TX With Wagmi"
              isLoading={isSendTxLoading}
            />
          )}
          <Button onPress={handleLogout} title="Logout" />
        </View>
      </View>
    </>
  );
};

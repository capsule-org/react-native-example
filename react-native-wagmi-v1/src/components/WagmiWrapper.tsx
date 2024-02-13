import {CapsuleConnector} from '@usecapsule/react-native-wallet';
import {configureChains, createConfig, WagmiConfig} from 'wagmi';
import {alchemyProvider} from 'wagmi/providers/alchemy';
import {sepolia} from 'viem/chains';
import {capsule} from '../clients/capsule';
import {PropsWithChildren} from 'react';

const {chains, publicClient, webSocketPublicClient} = configureChains(
  [sepolia],
  [alchemyProvider({apiKey: 'HfT9dMNs3W0h1vJmiPZQ_APaFjPo-BF9'})],
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new CapsuleConnector({
      capsule,
      chains,
      options: {},
      appName: 'Mobile Example',
      disableModal: true,
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export const WagmiWrapper = ({children}: PropsWithChildren) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

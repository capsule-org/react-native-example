# Capsule React Native - Viem v2 Example

This example uses `react-native` v0.73, but can be plugged in to any of the other react native example versions, just add `viem` and `ethers` to any of the other examples using the following command.

```bash
yarn add viem ethers
```

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

> **Note**: If using NVM (or another version manager for Node), please refer to [this step](https://reactnative.dev/docs/environment-setup#optional-configuring-your-environment) for properly configuring your Xcode environment

### Step 1: Install app dependecies

```bash
yarn && yarn pod-install
```

### Step 2: Add your API key

Replace `YOUR_API_KEY` in `./src/clients/capsule.ts` with your valid API key.

### Step 3: Start your Application

#### For Android

```bash
yarn android
```

#### For iOS

```bash
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

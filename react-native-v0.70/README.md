# Capsule React Native v0.70 Example

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/0.70/environment-setup) instructions till "Creating a new application" step, before proceeding.

> **Note**: If using NVM (or another version manager for Node), please refer to [this step](https://reactnative.dev/docs/0.70/environment-setup#optional-configuring-your-environment) for properly configuring your Xcode environment

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

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/0.70/troubleshooting) page.

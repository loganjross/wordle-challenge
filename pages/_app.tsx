import type { AppProps } from "next/app";
import Head from "next/head";

import { GameProvider } from "@/providers/GameProvider";
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import { ModalsProvider } from "@/providers/ModalsProvider";
import { Navbar } from "@/components/Navbar";
import { Notifications } from "@/components/Notifications";
import { SettingsModal } from "@/components/SettingsModal";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Authenticle</title>
        <meta name="description" content="Wordle challenge for Authentic" />
      </Head>
      <NotificationsProvider>
        <GameProvider>
          <ModalsProvider>
            <Navbar />
            <Notifications />
            <Component {...pageProps} />
            <SettingsModal />
          </ModalsProvider>
        </GameProvider>
      </NotificationsProvider>
    </>
  );
}

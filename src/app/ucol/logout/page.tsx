"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import useUserStore from "@/store/ucol/userStore";

import GoodbyeIllustration from "@icons/ucol_goodbye.svg";
import styles from "./page.module.scss";

export default function Entidades() {
  const router = useRouter();
  const seeYouName = useUserStore((state) => state.seeYouName);
  const clearUser = useUserStore((state) => state.clearUser);
  
  const handleGoLogin = () => {
    router.push("/login");
  }

  useEffect(() => {
    const handlePopState = () => {
      history.pushState(null, '', window.location.href);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    clearUser();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Adiós
      </div>

      <GoodbyeIllustration
        style={{
          height: "256px",
          width: "256px",
        }}
      />

      <div className={styles.message}>
        ¡Hasta luego, {seeYouName}!
      </div>

      <button
        onClick={handleGoLogin}
      >
        Iniciar sesión
      </button>
    </div>
  );
}

import { createContext, useContext, useState } from "react";

export type Modal = "settings";

const ModalsContext = createContext<{
  currentOpenModals: Modal[];
  openModal: (modal: Modal) => void;
  closeModal: (modal: Modal) => void;
}>({
  currentOpenModals: [],
  openModal: () => {},
  closeModal: () => {},
});

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [currentOpenModals, setCurrentOpenModals] = useState<Modal[]>([]);

  function openModal(modal: Modal) {
    setCurrentOpenModals((currentOpenModals) => [...currentOpenModals, modal]);
  }

  function closeModal(modal: Modal) {
    setCurrentOpenModals((currentOpenModals) =>
      currentOpenModals.filter((m) => m !== modal)
    );
  }

  return (
    <ModalsContext.Provider
      value={{
        currentOpenModals,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  return useContext(ModalsContext);
}

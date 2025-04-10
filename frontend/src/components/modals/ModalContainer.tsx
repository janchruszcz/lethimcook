import { useModalStore } from "../../stores/useModalStore";
import { AuthModal } from "../auth/AuthModal";
import { CreateRecipeModal } from "../recipe/CreateRecipeModal";

export function ModalContainer() {
    const { 
      showAuthModal, 
      showCreateRecipeModal, 
      closeAuthModal, 
      closeCreateRecipeModal 
    } = useModalStore();
  
    return (
      <>
        {showAuthModal && <AuthModal onClose={closeAuthModal} />}
        {showCreateRecipeModal && (
          <CreateRecipeModal 
            isOpen={showCreateRecipeModal} 
            onClose={closeCreateRecipeModal} 
          />
        )}
      </>
    );
  }
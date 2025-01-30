import React from 'react';

import {
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface EmailNotRegisteredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterViaAdmin: () => void;
  onCancel: () => void;
}

const EmailNotRegisteredDialog: React.FC<EmailNotRegisteredDialogProps> = ({ isOpen, onClose, onRegisterViaAdmin, onCancel }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Email Tidak Terdaftar</AlertDialogHeader>
          {/* <AlertDialogBody>
            Email Anda tidak terdaftar di database kami. Silakan mendaftar via Admin atau kembali ke halaman utama.
          </AlertDialogBody> */}
          <AlertDialogFooter>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button variant="default" onClick={onRegisterViaAdmin} style={{ marginLeft: '12px' }}>Register via Admin</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default EmailNotRegisteredDialog;

import React, { FC } from "react";
import { Box, Modal } from "@mui/material";
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  Component: React.ComponentType<{
    setOpen: (open: boolean) => void;
    setRoute: (route: string) => void;
  }>;
  setRoute: (route: string) => void;
};

const CustomModel: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  Component,
  activeItem,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] dark:bg-slate-900 bg-white rounded-[8px] shadow p-4 outline-none overflow-y-auto max-h-[90vh]">
        <Component setOpen={setOpen} setRoute={setRoute} />
      </Box>
    </Modal>
  );
};

export default CustomModel;

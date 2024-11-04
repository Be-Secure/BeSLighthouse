import * as React from "react";
import { Button, Modal, Fade, Box, Grid, Backdrop } from "@mui/material";
import MKTypography from "../../components/MKTypography";

const envPlaybookModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "60%",
  height: "60%",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ModalForEnvsAndPlaybook = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={ handleOpen }
        size="small"
        title="Show compatible envs and playbooks"
        disabled
        style={ {
          fontSize: "15px",
          color: "black",
          right: "16px",
          textTransform: "capitalize",
          fontWeight: "normal",
        } }
      >
        BeS Envs and Playbooks
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={ open }
        onClose={ handleClose }
        closeAfterTransition
        slots={ { backdrop: Backdrop } }
        slotProps={ { backdrop: { timeout: 500 } } }
      >
        <Fade in={ open }>
          <Box sx={ envPlaybookModalStyle }>
            <Grid container style={ { display: "flex", justifyContent: "space-around" } }>
              <Grid item>
                <MKTypography variant="h6" fontWeight="bold" style={ { fontSize: "15px" } }>
                  BeS Environments
                </MKTypography>
              </Grid>
              <Grid item>
                <MKTypography variant="h6" fontWeight="bold" style={ { fontSize: "15px", margin: "auto" } }>
                  BeS Playbooks
                </MKTypography>
              </Grid>
              <MKTypography style={ { position: "fixed", bottom: 0, fontSize: "12px" } }>
                Compatible BeS environments and BeS playbooks
              </MKTypography>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalForEnvsAndPlaybook;

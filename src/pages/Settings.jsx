import { PageContainer, PageHeader } from '../components/layout';
import { Box, Typography } from '@mui/material';

const Settings = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Configure your application preferences"
      />
      <Box>
        <Typography>Settings page coming soon...</Typography>
      </Box>
    </PageContainer>
  );
};

export default Settings;

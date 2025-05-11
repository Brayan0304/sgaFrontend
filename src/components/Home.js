import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Grid from '@mui/material/Grid';
import logo from '../images/logo.png';

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DemoPageContent() {
    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 2,

            }}
        >
            <Grid container spacing={2} alignItems='center'>
                <Grid size={12}><Outlet /></Grid>
            </Grid>

        </Box>
    );
}



DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccount(props) {
    const navigate = useNavigate();
    const { window } = props;

    const [session, setSession] = React.useState({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    const router = React.useMemo(() => {
        return {
            pathname: window ? window() : '/',
            navigate: path => {
                navigate(path);
            },
        }

    });

    const NAVIGATION = [
        {
            segment: 'addstaff',
            title: 'Agregar Usuario',
            icon: <PersonAddAltIcon />,
            action: () => navigate('/addstaff'),

        },
        {
            segment: 'addsalary',
            title: 'Agregar Salario',
            icon: <LocalAtmIcon />,
            action: () => navigate('/addsalary'),
        },
        {
            segment: 'reports',
            title: 'Generar Reportes',
            icon: <PictureAsPdfIcon />,
            action: () => navigate('/reports'),
        },
        {
            segment: 'settings',
            title: 'Configuración',
            icon: <SettingsIcon />,
            action: () => navigate('/settings'),
        },
    ];

    const demoWindow = window !== undefined ? window() : undefined;
    return (
        <AppProvider
            session={session}
            authentication={authentication}
            navigation={NAVIGATION}
            branding={{
                logo: <img src={logo} />,
                title: 'SGA - Sistema de Gestión Documental',
            }}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <DemoPageContent />
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutAccount.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutAccount;

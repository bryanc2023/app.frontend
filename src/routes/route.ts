import EmpresaLayout from "../components/layout/EmpresaLayout"
import Navbar from "../components/layout/Navbar"
import PostulanteLayout from "../components/layout/PostulanteLayout"
import Home from "../pages/Home"
import Login from "../pages/Login"
import RegisterPage from "../pages/RegisterPage"
import RegistroE from "../pages/RegistroE"
import RegistroP from "../pages/RegistroP"
import Unauthorized from "../pages/Unauthorized"
import InicioAdmin from "../pages/admin/InicioAdmin"
import CompletarE from "../pages/empresa/CompletarE"
import InicioE from "../pages/empresa/InicioE"
import VerOfertasPPage from "../pages/empresa/VerOfertasPage"
import CompletarP from "../pages/postulante/CompletarP"
import CompletarP2 from "../pages/postulante/CompletarP2"
import InicioP from "../pages/postulante/InicioP"
import VerifyEmail from "../pages/postulante/VerifyEmail"
import ConsultoPostu from "../pages/empresa/ConsultoPostu"
import MoniR from "../pages/empresa/MoniR"
import ResultadosP from "../pages/postulante/ResultadosP"
import PerfilP from "../pages/postulante/PerfilP"
import AgregarO from "../pages/empresa/AgregarO"
import VerOfertasAll from "../pages/postulante/VerOfertasAll"
import PerfilE from "../pages/empresa/PerfilE"
import EmpresaGLayout from "../components/layout/EmpresaGLayout"
import InicioG from "../pages/empresaG/InicioG"
import CatalogoRegistro from "../pages/empresaG/CatalogoRegistro"
import AgregarOferG from "../pages/empresaG/AgregarOferG"
import MonitoreoG from "../pages/empresaG/MonitoreoG"
import PerfilG from "../pages/empresaG/PerfilG"
import ReportesG from "../pages/empresaG/ReportesG"
import PostulanteDetallePage from "../pages/empresa/PostulanteDetallePage"
import AdminLayout from "../components/layout/AdminLayout"
import VistaPreviaArchivo from "../components/Admin/VistaPreviaArchivo"  
import ConfiguracionAdmin from "../pages/admin/ConfiguracionAdmin"
import VerCV from "../pages/postulante/VerCV"
import ConsultoPostuG from "../pages/empresaG/ConsultoPostuG"
import EditarO from "../pages/empresa/EditarO"
import GestionUsuarios from "../pages/admin/GestionUsuarios"
import EditarOG from "../pages/empresaG/EditarOG"
import EmailRequest from "../pages/EmailRequest"
import ResetPassword from "../pages/ResetPassword"

type TypeRoute = {
    path: string;
    element: any;
    isProtected?: boolean;
    children?: TypeRoute[];
    allowedRoles?: string[];
};

export const routes: TypeRoute[] = [
    {
        path: '/',
        element: Home,
    },
    {
        path: '/registro',
        element: RegisterPage,
    },
    {
        path: '/login',
        element: Login,
    },
    {
        path: '/EmailRequest',
        element: EmailRequest,
    },
    {
        path: '/ResetPassword/:token',
        element: ResetPassword,
    },
    {
        path: '/register',
        element: RegistroP,
    },
    {
        path: '/registerE',
        element: RegistroE,
    },
    {
        path: '/inicio',
        element: PostulanteLayout,
        isProtected: true,
        allowedRoles: ['postulante'],
        children: [
            {
                path: '',
                element: InicioP,
                allowedRoles: ['postulante'],
            },
            
        ],
    },
    {
        path: '/verOfertasAll',
        element: PostulanteLayout,
        isProtected: true,
        allowedRoles: ['postulante'],
        children: [
            {
                path: '',
                element: VerOfertasAll,
                allowedRoles: ['postulante'],
            },
            
        ],
    },
    {
        path: '/verifyEmail/:id/:token',
        element: VerifyEmail,
    },
    {
        path: '/completar',
        element: CompletarP,
        isProtected: true,
        allowedRoles: ['postulante'],
    },
    {
        path: '/completar-2',
        element: CompletarP2,
        isProtected: true,
        allowedRoles: ['postulante'],
    },
    {
        path: '/completare',
        element: CompletarE,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
    },
    {
        path: '/inicio-e',
        element: EmpresaLayout,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
        children: [
            {
                path: '',
                element: InicioE,
                allowedRoles: ['empresa_oferente'],
            },
            
        ],
    },
    {
        path: '/add-oferta',
        element: EmpresaLayout,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
        children: [
            {
                path: '',
                element: AgregarO,
                allowedRoles: ['empresa_oferente'],
            },
            
        ],
    },
    {
        path: '/',
        element: PostulanteLayout,
        isProtected: true,
        allowedRoles: ['postulante'],
        children: [
            {
                path: 'resultadosP',
                element: ResultadosP,
                allowedRoles: ['postulante'],
            },
            
        ],
    },
    {
        path: '/',
        element: PostulanteLayout,
        isProtected: true,
        allowedRoles: ['postulante'],
        children: [
            {
                path: 'perfilP',
                element: PerfilP,
                allowedRoles: ['postulante'],
            },
            
        ],
    },
    {
        path: '/',
        element: PostulanteLayout,
        isProtected: true,
        allowedRoles: ['postulante'],
        children: [
            {
                path: 'vercv',
                element: VerCV,
                allowedRoles: ['postulante'],
            },
            
        ],
    },
    {
        path: '/',
        element: EmpresaLayout,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
        children: [
            {
                path: 'verOfertasE',
                element: VerOfertasPPage,
                allowedRoles: ['empresa_oferente'],
            },
            
        ],
    },
    {
        path: '/',
        element: EmpresaLayout,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
        children: [
            {
                path: 'PerfilE',
                element: PerfilE,
                allowedRoles: ['empresa_oferente'],
            },
            
        ],
    },
    {
        path: '/',
        element: EmpresaLayout,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
        children: [
            {
                path: 'ConsPost',
                element: ConsultoPostu,
                allowedRoles: ['empresa_oferente'],
             
            },
            {
                path: 'perfildet/:id_postulante',
                element: PostulanteDetallePage,
                allowedRoles: ['empresa_oferente'],
            }
            ,
            {
                path: 'edit-oferta/:id',
                element: EditarO,
                allowedRoles: ['empresa_oferente'],
            },
            
        ],
    },
    
    {
        path: '/',
        element: EmpresaLayout,
        isProtected: true,
        allowedRoles: ['empresa_oferente'],
        children: [
            {
                path: 'MoniR',
                element: MoniR,
                allowedRoles: ['empresa_oferente'],
            },
           
            
        ],
    },
    {
        path: '/',
        element: AdminLayout,
        isProtected: true,
        allowedRoles: ['admin'],
        children: [
            {
                path: 'InicioAdmin',
                element: InicioAdmin,
                allowedRoles: ['admin'],
            },
            {
                path: 'vista-previa',
                element: VistaPreviaArchivo,
                allowedRoles: ['admin'],
            },
            {
                path: 'configuracion',
                element: ConfiguracionAdmin,
                allowedRoles: ['admin'],
            },
            {
                path: 'gestion-u',
                element: GestionUsuarios,
                allowedRoles: ['admin'],
            },
        ],
    },
    {
        path: '/',
        element: EmpresaGLayout,
        isProtected: true,
        allowedRoles: ['empresa_gestora'],
        children: [
            {
                path: 'InicioG',
                element: InicioG,
                allowedRoles: ['empresa_gestora'],
            },
            {
                path: 'CatalogoRegistro',
                element: CatalogoRegistro,
                allowedRoles: ['empresa_gestora'],
            },
            {
                path: 'ConsultoPostuG',
                element: ConsultoPostuG,
                allowedRoles: ['empresa_gestora'],
            },
            {
                path: 'add-ofertaG',
                element: AgregarOferG,
                allowedRoles: ['empresa_gestora'],
            },
            {
                path: 'MonitoreoG',
                element: MonitoreoG,
                allowedRoles: ['empresa_gestora'],
            },
            {
                path: 'PerfilG',
                element: PerfilG,
                allowedRoles: ['empresa_gestora'],
            },
            {
                path: 'ReportesG',
                element: ReportesG,
                allowedRoles: ['empresa_gestora'],
            },
            ,
            {
                path: 'edit-ofertaG/:id',
                element: EditarOG,
                allowedRoles: ['empresa_gestora'],
            },
        ],
    },
    {
        path: '/unauthorized',
        element: Unauthorized, 
    },
];

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../services/axios';
import ModalDetail from '../../components/ModalPostu';
import PostulanteDetail from '../../pages/empresa/PostuDeta';
import { RootState } from '../../store';
import jszip from 'jszip';
import FileSaver from 'file-saver';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import { FaInfoCircle, FaUserTie, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface Postulacion {
    id_oferta: number;
    total_evaluacion: number;
    fecha_oferta: string;
    oferta: {
        id_oferta: number;
        cargo: string;
        empresa: {
            nombre_comercial: string;
        };

        postulantes: {
            id_postulante: number;
            nombres: string;
            apellidos: string;
            fecha_nac: string;
            edad: number;
            estado_civil: string;
            cedula: string;
            genero: string;
            informacion_extra: string;
            foto: string;
            cv: string | null;
            total_evaluacion: number;
            fecha: string;
            estado_postulacion: string;
        }[];
    };
}
interface Postulante {
    id_postulante: number;
    nombres: string;
    apellidos: string;
    fecha_nac: string;
    edad: number;
    estado_civil: string;
    cedula: string;
    genero: string;
    informacion_extra: string;
    foto: string;
    cv: string | null;
    total_evaluacion: number;
    fecha: string;
    estado_postulacion: string;
}




const PostulantesList: React.FC = () => {
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [selectedPostulante, setSelectedPostulante] = useState<Postulante | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOfertaId, setSelectedOfertaId] = useState<number | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const [numCVs, setNumCVs] = useState<number>(1);
    const [showSteps, setShowSteps] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postulantesPerPage = 5; // Cantidad de postulantes por página
    const [selectedFecha, setSelectedFecha] = useState<string>('');
    const [showDescargaModal, setShowDescargaModal] = useState(false);
    const [selectedFechaInicio, setSelectedFechaInicio] = useState<string>('');
    const [selectedFechaFin, setSelectedFechaFin] = useState<string>('');

    const openDescargaModal = () => {
        setShowDescargaModal(true);
    };

    const closeDescargaModal = () => {
        setShowDescargaModal(false);
        setNumCVs(1);
    };







    const handleShowSteps = () => {
        setShowSteps(!showSteps);
    };

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await axios.get(`postulacionesE/${user?.id}`);
                const postulacionesData = transformarRespuesta(response.data.postulaciones);
                setPostulaciones(postulacionesData);

            } catch (error) {
                console.error('Error fetching postulaciones:', error);
            }
        };

        if (user?.id) {
            fetchPostulaciones();
        }
    }, [user]);

    const handleShowModal = (postulante: Postulante, idOferta: number) => {
        setSelectedPostulante(postulante);
        setSelectedOfertaId(idOferta);

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostulante(null);
    };

    const renderEstadoPostulacion = (estado: string) => {
        switch (estado) {
            case 'P':
                return 'Pendiente a revisión';
            case 'A':
                return 'Aceptado';
            case 'R':
                return 'Rechazado';
            default:
                return '-';
        }
    };

    const transformarRespuesta = (data: any): Postulacion[] => {
        const postulacionesArray: Postulacion[] = [];

        Object.keys(data).forEach((key) => {
            const ofertaId = parseInt(key);
            const ofertaData = data[key];
            const postulacion: Postulacion = {
                id_oferta: ofertaData.id_oferta,
                total_evaluacion: 0,
                fecha_oferta: ofertaData.fecha_oferta,
                oferta: {
                    id_oferta: ofertaData.id_oferta,
                    cargo: ofertaData.cargo,
                    empresa: {
                        nombre_comercial: 'Nombre de empresa',
                    },
                    postulantes: ofertaData.postulantes.map((postulante: any) => ({
                        id_postulante: postulante.id_postulante,
                        nombres: postulante.nombres,
                        apellidos: postulante.apellidos,
                        fecha_nac: postulante.fecha_nac,
                        edad: postulante.edad,
                        estado_civil: postulante.estado_civil,
                        cedula: postulante.cedula,
                        genero: postulante.genero,
                        informacion_extra: postulante.informacion_extra,
                        foto: postulante.foto,
                        cv: postulante.cv,
                        total_evaluacion: postulante.total_evaluacion,
                        fecha: postulante.fecha,
                        estado_postulacion: postulante.estado_postulacion,
                    })),
                },
            };

            postulacionesArray.push(postulacion);
        });

        return postulacionesArray;
    };

    // Obtener todas las ofertas disponibles
    const allOfertas = postulaciones.map(postulacion => ({
        id_oferta: postulacion.id_oferta,
        cargo: postulacion.oferta.cargo,
        fecha_oferta: postulacion.fecha_oferta,
    }));

    // Filtrar las ofertas por fecha seleccionada
    const ofertasFiltradas = selectedFechaInicio && selectedFechaFin
        ? allOfertas.filter(oferta => {
            const fechaOferta = new Date(oferta.fecha_oferta);
            const fechaInicio = new Date(selectedFechaInicio);
            const fechaFin = new Date(selectedFechaFin);
            return fechaOferta >= fechaInicio && fechaOferta <= fechaFin;
        })
        : [];

    // Actualizar las opciones del select basado en las ofertas filtradas
    const ofertaOptions = ofertasFiltradas.map((oferta, index) => (
        <option key={index} value={oferta.id_oferta}>
            OFERTA {index + 1}: {oferta.cargo}
        </option>
    ));


    const filteredPostulaciones = selectedOfertaId
        ? postulaciones.find(postulacion => postulacion.id_oferta === selectedOfertaId)
        : null;

    const getBackgroundColor = (estado: string) => {
        switch (estado) {
            case 'P':
                return 'bg-gray-200'; // Gris para estado Pendiente
            case 'A':
                return 'bg-green-200'; // Verde para estado Aceptado
            case 'R':
                return 'bg-red-200'; // Rojo para estado Rechazado
            default:
                return ''; // Por defecto no se aplica ningún fondo especial
        }
    };



    const descargarCVs = async () => {
        if (!filteredPostulaciones) return;

        const zip = new jszip();
        const promises: any[] = [];

        filteredPostulaciones.oferta.postulantes.slice(0, numCVs).forEach((postulante, index) => {
            const nombreArchivo = `${index + 1}-${postulante.nombres}-${postulante.apellidos}.pdf`;

            if (postulante.cv) {
                //const storageRef = ref(storage, postulante.cv);
                // Create a reference to the file we want to download
                const storage = getStorage();
                const starsRef = ref(storage, postulante.cv);
                promises.push(
                    getDownloadURL(starsRef).then(url => {
                        console.log("URL de descarga:", url);
                        return fetch(url)
                            .then(response => response.blob())
                            .then(blob => {
                                zip.file(nombreArchivo, blob, { binary: true });
                            })
                            .catch(error => {
                                console.error("Error al obtener el archivo:", error);
                            });
                    }).catch(error => {
                        console.error("Error al obtener URL de descarga:", error);
                    })
                );
            }
        });

        await Promise.all(promises);

        const nombreZip = `CVs_${filteredPostulaciones.oferta.cargo}.zip`;

        zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, nombreZip);
        });
        setNumCVs(1);
    };

    // Calcula el índice inicial y final de los postulantes a mostrar según la página actual
    const indexOfLastPostulante = currentPage * postulantesPerPage;
    const indexOfFirstPostulante = indexOfLastPostulante - postulantesPerPage;
    const currentPostulantes = filteredPostulaciones ? filteredPostulaciones.oferta.postulantes.slice(indexOfFirstPostulante, indexOfLastPostulante) : [];

    const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevaFechaFin = e.target.value;
        if (selectedFechaInicio && new Date(nuevaFechaFin) < new Date(selectedFechaInicio)) {
            Swal.fire('Error', 'La fecha fin no puede ser menor que la fecha de inicio', 'error');
        } else {
            setSelectedFechaFin(nuevaFechaFin);
        }
    };
    

    return (
        <div className="mb-4 text-center max-w-screen-lg mx-auto">

            <div className="w-full p-4">
                <div className="mb-4 text-center">
                    <h1 className="text-3xl font-bold mb-4 flex justify-center items-center text-orange-500 ml-2">
                        CONSULTA DE POSTULANTES
                        <FaUserTie className="text-orange-500 ml-2" />
                    </h1>
                    <p>En esta sección te mostramos todos los postulantes para cada oferta publicada , en esta sección solo aparecerán las ofertas si es que cuenta con al menos un postulante. Toma en consideración el top 3 que se muestra con la posición de cada postulante en base a su evaluación</p>
                </div>
                <ul className="list-none mb-4">
                    <li className="flex items-center mb-2 cursor-pointer" onClick={handleShowSteps}>
                        <FaInfoCircle className="text-blue-500 mr-2" />
                        <b> <span>¿Cómo descargar las hojas de vida?</span></b>
                    </li>

                </ul>
                {showSteps && (
                    <ul className="list-disc pl-8 mb-4" style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <p>Puedes descargar las hojas de vida de los postulantes para verlas a detalle, se descargaran en orden de su evaluación correspondiente. O puedes descargarlas manualmente la que te interese</p>
                        <p><b><i>- Paso 1: </i></b>Seleccione una fecha de inicio y de fin de publicación que desees para mostrar las ofertas dentro de ese intervalo de tiempo</p>
                        <p><b><i>- Paso 2: </i></b>Seleccione una oferta</p>
                        <p><b><i>- Paso 3: </i></b>De click en "Descarga de hojas de vida masiva"</p>
                        <p><b><i>- Paso 4: </i></b>Indique la cantidad de hojas de vida (no mayor a las disponibles)</p>

                    </ul>
                )}
                <div className="mb-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="mb-4">
    <label className="block font-semibold text-orange-500 mb-2 text-center">Fecha de Publicación:</label>
    <div className="flex justify-center space-x-4">
        <div>
            <label htmlFor="selectFechaInicio" className="mr-2 font-semibold text-orange-500">Fecha inicio:</label>
            <input
                type="date"
                id="selectFechaInicio"
                className="px-2 py-1 border border-gray-300 rounded"
                value={selectedFechaInicio}
                onChange={(e) => setSelectedFechaInicio(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="selectFechaFin" className="mr-2 font-semibold text-orange-500">Fecha fin:</label>
            <input
                type="date"
                id="selectFechaFin"
                className="px-2 py-1 border border-gray-300 rounded"
                value={selectedFechaFin}
                onChange={handleFechaFinChange}
            />
        </div>
    </div>
</div>
                    <div>
                        <label htmlFor="selectOferta" className="mr-2 font-semibold text-orange-500">Selecciona una oferta:</label>
                        <select
                            id="selectOferta"
                            className="px-2 py-1 border border-gray-300 rounded w-full"
                            value={selectedOfertaId || ''}
                            onChange={(e) => setSelectedOfertaId(parseInt(e.target.value) || null)}
                        >
                            <option value="">Seleccione..</option>
                            {ofertaOptions}
                        </select>
                    </div>
                </div>


            </div>

            {filteredPostulaciones ? (
                <>
                    <hr className="my-4" />
                    <div className="flex justify-end mb-4">
                        {/* Botón para abrir el modal de descarga masiva */}
                        <button onClick={openDescargaModal} className="bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded">
                            Descarga masiva de hojas de vida
                        </button>
                    </div>

                    <center>
                        <h1 className="text-2xl mb-4"><b>OFERTA:</b> {filteredPostulaciones.oferta.cargo}</h1>
                    </center>

                    {filteredPostulaciones.oferta.postulantes.some(postulante => postulante.estado_postulacion === 'A') && (

                        <div className="flex items-center mb-4">

                            <FaCheckCircle className="text-green-500 text-xl mr-2" />
                            <p className="text-lg text-green-500 font-semibold">Ya se ha seleccionado un postulante para esta oferta</p>

                        </div>

                    )}

                    <div className="text-lg font-semibold text-gray-700 flex  items-center">
                        <FaUserTie className="text-black-500 ml-2" />
                        Número de Postulantes en esta oferta ({filteredPostulaciones ? filteredPostulaciones.oferta.postulantes.length : 0})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                        {currentPostulantes.map((postulante, index) => (
                            <div key={postulante.id_postulante} className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                {/* Número en la esquina superior izquierda */}
                                <div className={`absolute top-0 left-0 py-1 px-2 rounded-tr-lg rounded-bl-lg ${index >= 3 || currentPage > 1 ? 'bg-gray-500 text-gray-100' : 'bg-orange-500 text-white'}`}>
                                    {(currentPage - 1) * postulantesPerPage + index + 1}
                                </div>


                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <img
                                                src={postulante.foto}
                                                alt="Foto de perfil"
                                                className="w-40 h-36  mr-2"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {postulante.nombres} {postulante.apellidos}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    <b> Género: </b>{postulante.genero}, <b> Edad:</b> {postulante.edad} años
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <b> Nota de evaluación en hoja de vida: </b>{postulante.total_evaluacion}
                                                </p>

                                            </div>
                                        </div>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleShowModal(postulante, filteredPostulaciones.id_oferta)}
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>

                                </div>
                                <div className={`border-t border-gray-200 p-4 ${getBackgroundColor(postulante.estado_postulacion)}`}>
                                    <p className="text-sm text-gray-600">
                                        <b>Estado de postulación:</b> {renderEstadoPostulacion(postulante.estado_postulacion)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <b>Fecha postulación: </b>{postulante.fecha}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Paginación */}
                    {filteredPostulaciones.oferta.postulantes.length > postulantesPerPage && (
                        <div className="mt-4 flex justify-end">
                            <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                                <a
                                    href="#"
                                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    Anterior
                                </a>
                                {Array.from({ length: Math.ceil(filteredPostulaciones.oferta.postulantes.length / postulantesPerPage) }, (_, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === index + 1 ? 'bg-neutral-900 text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {index + 1}
                                    </a>
                                ))}
                                <a
                                    href="#"
                                    onClick={() => setCurrentPage(currentPage < Math.ceil(filteredPostulaciones.oferta.postulantes.length / postulantesPerPage) ? currentPage + 1 : Math.ceil(filteredPostulaciones.oferta.postulantes.length / postulantesPerPage))}
                                    className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === Math.ceil(filteredPostulaciones.oferta.postulantes.length / postulantesPerPage) ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    Siguiente
                                </a>
                            </nav>
                        </div>



                    )}

                    {/* Modal de descarga de hojas de vida */}
                    {showDescargaModal && (
                        <div className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-4">
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                        Descarga masiva de hojas de vida
                                                    </h3>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Seleccione la cantidad de hojas de vida (CVs) desea descargar y luego presione el botón "Descargar".
                                                        </p>
                                                        <div className="mt-4">
                                                            <div className="flex items-center mb-4">
                                                                <FaFileAlt className="text-gray-600 mr-2" />
                                                                <label htmlFor="numCVs" className="block text-sm font-medium text-gray-700">
                                                                    Número de CVs a descargar:
                                                                </label>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                id="numCVs"
                                                                name="numCVs"
                                                                min="1"
                                                                max={filteredPostulaciones.oferta.postulantes.length}
                                                                value={numCVs}
                                                                onChange={(e) => setNumCVs(parseInt(e.target.value))}
                                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-orange-300 "
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            onClick={() => {
                                                descargarCVs();
                                                closeDescargaModal();
                                            }}
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Descargar CVs
                                        </button>
                                        <button
                                            onClick={closeDescargaModal}
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>


            ) : (
                <p></p>
            )}

            {selectedPostulante && selectedOfertaId !== null && (
                <ModalDetail show={showModal} onClose={handleCloseModal}>
                    <PostulanteDetail
                        postulante={selectedPostulante}
                        idOferta={selectedOfertaId}
                        onClose={handleCloseModal}
                    />
                </ModalDetail>
            )}


        </div>
    );
};

export default PostulantesList;

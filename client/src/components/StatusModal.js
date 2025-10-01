import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { imageShow, videoShow } from '../utils/mediaShow';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

import { Container, Form } from 'react-bootstrap';

import communesjson from "../json/communes.json"
import { createPostAprove, updatePost } from '../redux/actions/postAproveAction';

import { ItemsCategory } from './categorias/CategorySelect';
import { TitleInput } from './categorias/Title';
import { SuporteDeLaObra } from './categorias/Suporte';
import { ItemsSubCategorySculpture } from './categorias/Sculpture';
import { ItemsSubCategoryPhotographie } from './categorias/Potography';
import { ItemsSubCategoryDesign } from './categorias/Dessin'
import { ItemsSubCategoryGravures } from './categorias/GravuresEstampes';
import { ItemsSubCategoryArtsNumeriques } from './categorias/ArtNumirique';

import { DescriptionInput } from './categorias/Descriptionn';


import { ItemsSubCategoryCollages } from './categorias/Collage';
import { ItemsSubCategoryArtTextile } from './categorias/ArtTextile';

import { ItemsSubCategoryStyle } from './categorias/Style';
import { ItemsTheme } from './categorias/Theme';
import { MesureInput } from './categorias/Mesure';
import { Derechosdelautor } from './categorias/DerechoAutor';
import { UniteMesure } from './categorias/UniteMesure';
import { Envolverlaobra } from './categorias/EnvolverObra';

import { PriceInput } from './categorias/Prix';
import { DeviseVente } from './categorias/DeviseUnity'
import { TalleSelect } from './categorias/Talle';

import { Negociarprecio } from './categorias/Negociable';
import { VenteOptionsSelect } from './categorias/OptionDeVente';
import { ItemsSubCategoryPeinture } from './categorias/Peinture';
//import { Paises } from './categorias/Pais';
import { WilayaCommune } from './StatusModalComponents';

import { useTranslation } from 'react-i18next';




const StatusModal = () => {

    const { auth, theme, socket, status, languageReducer } = useSelector((state) => state);

    const { t } = useTranslation('statusmodal');
    const lang = languageReducer.language || 'en';

    const dispatch = useDispatch()
    const initialState = {
        category: '',
        subcategory: '',
        envolverobra: '',
        title: '',
        derechoautor: '',
        measurementValue: '',
        venteOption: '',
        support: '',
        price: '',
        style: '',
        negociable: "",
        devisvente: '',

        talle: '',

        theme: '',
        measurementUnit: '',
        description: '',
        wilaya: "",
        commune: "",
    }




    // 2. Función para cambiar dinámicamente la categoría (opcional, si la necesitas)
    const [postData, setPostData] = useState(initialState);
    const [images, setImages] = useState([])
    const [selectedWilaya, setSelectedWilaya] = useState("");
    // const [selectedCountry, setSelectedCountry] = useState('');
    const [stream, setStream] = useState(false)
    const videoRef = useRef()
    const refCanvas = useRef()
    const [tracks, setTracks] = useState('')
    /*
        const handleStream = () => {
            setStream(true)
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(mediaStream => {
                        videoRef.current.srcObject = mediaStream
                        videoRef.current.play()
    
                        const track = mediaStream.getTracks()
                        setTracks(track[0])
                    }).catch(err => console.log(err))
            }
        }
    */
    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute("width", width)
        refCanvas.current.setAttribute("height", height)

        const ctx = refCanvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, { camera: URL }])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }




    const handleChangeInput = (e) => {
        const { name, value, type, checked } = e.target;

        setPostData(prevState => {
            const isCheckbox = type === "checkbox";
            const isAttribute = prevState.attributes && Object.prototype.hasOwnProperty.call(prevState.attributes, name);

            if (isAttribute) {
                return {
                    ...prevState,
                    attributes: {
                        ...prevState.attributes,
                        [name]: isCheckbox ? checked : value
                    }
                };
            } else {
                return {
                    ...prevState,
                    [name]: isCheckbox ? checked : value
                };
            }
        });
    };

    /*
        const handleChangeImages = e => {
            const files = [...e.target.files]
            let err = ""
            let newImages = []
        
            // 🔥 Determinar límite según el rol del usuario
            const maxImages = auth.user?.role === "Super-utilisateur" ? 4 : 2;
            const totalAfterUpload = images.length + files.length;
        
            // Validar límite de imágenes
            if (totalAfterUpload > maxImages) {
                err = `Maximum ${maxImages} images allowed. ${maxImages === 2 ? 
                       "Super-users can upload up to 4 images." : ""}`;
                dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
                return;
            }
        
            files.forEach(file => {
                if (!file) {
                    err = "File does not exist.";
                    return;
                }
        
                // 🔥 Validar tipo de archivo - SOLO IMAGENES
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    err = "Only image files are allowed (JPEG, JPG, PNG, GIF).";
                    return;
                }
        
                // Validar tamaño
                if (file.size > 1024 * 1024 * 5) {
                    err = "The image largest is 5mb.";
                    return;
                }
        
                newImages.push(file)
            })
        
            if (err) {
                dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
            } else {
                setImages([...images, ...newImages])
            }
        }
    */

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    const validateImageDimensions = (file, t, lang) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const { width, height } = img;

                // Validar dimensiones mínimas/máximas con traducción
                if (width < 100 || height < 100) {
                    resolve(t('errors.minDimensions', { width: 100, height: 100, lng: lang }));
                } else if (width > 4000 || height > 4000) {
                    resolve(t('errors.maxDimensions', { width: 4000, height: 4000, lng: lang }));
                } else {
                    resolve(null);
                }

                URL.revokeObjectURL(img.src);
            };

            img.onerror = () => resolve(t('errors.imageLoad', { lng: lang }));
        });
    };


    const handleChangeImages = async (e) => {
        let err = '';
        const files = [...e.target.files];
        const maxImages = 2;

        const totalAfterUpload = images.length + files.length;
        if (totalAfterUpload > maxImages) {
            err = t('errors.maxImages', { count: maxImages, lng: lang });
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
            return;
        }

        for (const file of files) {
            if (!file) {
                err = t('errors.fileNotExist', { lng: lang });
                break;
            }

            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                err = t('errors.invalidFileType', { lng: lang });
                break;
            }

            if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-_.]+$/.test(file.name)) {
                err = t('errors.invalidFileName', { file: file.name, lng: lang });
                break;
            }

            if (file.size > 5 * 1024 * 1024) {
                err = t('errors.maxFileSize', { lng: lang });
                break;
            }

            const dimensionError = await validateImageDimensions(file);
            if (dimensionError) {
                err = t('errors.invalidDimensions', { lng: lang });
                break;
            }

            if (images.some(img => img.name === file.name)) {
                err = t('errors.duplicateFile', { file: file.name, lng: lang });
                break;
            }
        }

        if (err) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
        } else {
            setImages([...images, ...files]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!postData.category) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('errors.noCategory', { lng: lang }) },
            });
        }

        if (images.length === 0) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('errors.noImage', { lng: lang }) },
            });
        }


        if (images.length > 2) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('errors.maxImages', { count: 2, lng: lang }) },
            });
        }



        if (status.onEdit) {
            dispatch(updatePost({ postData, images, auth, status }));
        } else {
            dispatch(createPostAprove({ postData, images, auth, socket }));
        }

        // Resetear el formulario
        setPostData(initialState);
        setImages([]);
        dispatch({ type: GLOBALTYPES.STATUS, payload: false });
    };




    useEffect(() => {

        if (status?.onEdit) {
            setPostData({


                category: status.category || "",
                subcategory: status.subcategory || "",
                title: status.title || "",
                derechoautor: status.derechoautor || "",
                measurementValue: status.measurementValue || "",
                venteOption: status.venteOption || "",
                price: status.price || "",
                negociable: status.negociable || "",
                subCategorySculpture: status.telefono || "",
                support: status.suporte || "",
                envolverobra: status.envolverobra || "",
                style: status.style || "",
                theme: status.theme || "",
                devisvente: status.devisvente || "",

                talle: status.talle || "",
                measurementUnit: status.measurementUnit || "",
                description: status.description || "",
                wilaya: status.wilaya || "",
                commune: status.commune || "",

            });
            setImages(status.images || []);
            setSelectedWilaya(status.wilaya || "");



        }
    }, [status]);



    const ItemsCategoryy = () => (

        <ItemsCategory handleChangeInput={handleChangeInput} postData={postData} />



    )

    const TitleInputt = () => (
        <TitleInput handleChangeInput={handleChangeInput} postData={postData}

        />
    )

    const SuporteDeLaObraa = () => (
        <SuporteDeLaObra
            handleChangeInput={handleChangeInput}
            postData={postData}
            technique={postData?.subcategory}  // Ej: "huile"
            category={postData?.category}      // Ej: "Peinture"
        />

    )

    const ItemsSubCategoryPeinturee = () => (
        <ItemsSubCategoryPeinture handleChangeInput={handleChangeInput} postData={postData}

        />
    )

    const ItemsSubCategorySculpturee = () => (
        <div>
            < ItemsSubCategorySculpture handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )

    const ItemsSubCategoryPhotographiee = () => (
        <div>
            <ItemsSubCategoryPhotographie handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )





    const ItemsSubCategoryDesignn = () => (
        <div>
            <ItemsSubCategoryDesign handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )
    const ItemsSubCategoryGravuress = () => (
        <ItemsSubCategoryGravures
            postData={postData}
            handleChangeInput={handleChangeInput}

        />)



    const ItemsSubCategoryArtsNumeriquess = () => (
        <div>
            <ItemsSubCategoryArtsNumeriques handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )

    const ItemsSubCategoryCollagess = () => (
        <div>
            <ItemsSubCategoryCollages handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )
    const MesureInputt = () => (
        <div>
            <MesureInput handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )
    const UniteMesuree = () => (
        <div>
            <UniteMesure handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )


    const Envolverlaobraa = () => (
        <div>
            <Envolverlaobra handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )
    const Negociarprecioo = () => (
        <div>
            <Negociarprecio handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )

    const Derechosdelautorr = () => (
        <div>
            <Derechosdelautor handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )




    const Descriptionnn = () => (
        <div>
            <DescriptionInput handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )
    const ItemsSubCategoryArtTextilee = () => (
        <div>
            <ItemsSubCategoryArtTextile handleChangeInput={handleChangeInput} postData={postData} />
        </div>
    )

    const ItemsSubCategoryStylee = () => (
        <div>
            <ItemsSubCategoryStyle
                handleChangeInput={handleChangeInput}
                postData={postData}
                category={postData?.category} // Importante para el filtrado
            />
        </div>
    )

    const ItemsThemee = () => (
        <div>
            <ItemsTheme handleChangeInput={handleChangeInput} postData={postData} />
        </div>
    )
    const PriceInputt = () => (
        <div>
            <PriceInput handleChangeInput={handleChangeInput} postData={postData} />
        </div>
    )
    const DeviseVentee = () => (
        <div>
            <DeviseVente handleChangeInput={handleChangeInput} postData={postData} />
        </div>
    )



    const TalleSelectt = () => (
        <div>
            <TalleSelect handleChangeInput={handleChangeInput} postData={postData} />
        </div>
    )/*
    const ArtistLocationInputt = () => (
        <div>
            <ArtistLocationInput handleChangeInput={handleChangeInput} postData={postData} />
        </div>
    )*/


    const VenteOptionsSelectt = () => (
        <div>
            <VenteOptionsSelect handleChangeInput={handleChangeInput} postData={postData} />

        </div>
    )

    const handleWilayaChange = (event) => {
        const selectedWilaya = event.target.value;
        setSelectedWilaya(selectedWilaya);

        // Buscar la wilaya seleccionada
        const wilayaEncontrada = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya);
        const communes = wilayaEncontrada ? wilayaEncontrada.commune : [];

        // Establecer la primera comuna disponible o vacío


        // Actualizar postData con la wilaya seleccionada
        setPostData((prevState) => ({
            ...prevState,
            wilaya: selectedWilaya,
            commune: communes.length > 0 ? communes[0] : "", // Actualizar comuna si hay una disponible
        }));
    };
    const wilayasOptions = communesjson.map((wilaya, index) => (
        <option key={index} value={wilaya.wilaya}>
            {wilaya.wilaya}
        </option>
    ));
    const communesOptions = selectedWilaya
        ? communesjson
            .find((wilaya) => wilaya.wilaya === selectedWilaya)
            ?.commune?.map((commune, index) => (
                <option key={index} value={commune}>
                    {commune}
                </option>
            ))
        : [];
    const handleCommuneChange = (event) => {
        const selectedCommune = event.target.value;

        // Actualizar postData con la comuna seleccionada
        setPostData((prevState) => ({
            ...prevState,
            commune: selectedCommune,
        }));
    };
    /*
        const paisess = () => (
            <Paises
                handleChangeInput={handleChangeInput} postData={postData}
    
            />
        )
    */
    const wilayascommunes = () => (
        <WilayaCommune
            postData={postData}
            handleWilayaChange={handleWilayaChange}
            handleCommuneChange={handleCommuneChange}
            wilayasOptions={wilayasOptions}
            communesOptions={communesOptions}
        />
    )
    /*
    const ciudadInput = () => {
        if (selectedCountry === 'DZ') {
            return wilayascommunes();
        } else {
            return (
                <Form.Group controlId="cityInput" >
                    <Form.Label>Ville</Form.Label>
                    <Form.Control
                        type="text"
                        name="ville"
                        placeholder="Entrez votre ville"
                    />
                </Form.Group>
            );
        }
    };
    */
    return (
        <div className={`status_modal ${lang === 'ar' ? 'rtl' : ''}`}    >


            <Container>

                <Form onSubmit={handleSubmit}>
                    <div className="status_header">
                        <h3 className="m-0"> {t('titulostatusmoddal', { lng: lang })}</h3>
                        <span onClick={() => dispatch({
                            type: GLOBALTYPES.STATUS, payload: false
                        })}>
                            &times;
                        </span>
                    </div>

                    <Form.Group>
                        {postData.category === "Painting" && (
                            <div className='form-group'>
                                {ItemsSubCategoryPeinturee()}
                            </div>
                        )}

                        {postData.category === "Sculpture" && (
                            <div className='form-group'>
                                {ItemsSubCategorySculpturee()}
                            </div>
                        )}

                        {postData.category === "Photography" && (
                            <div className='form-group'>
                                {ItemsSubCategoryPhotographiee()}
                            </div>
                        )}

                        {postData.category === "drawing" && (
                            <div className='form-group'>
                                {ItemsSubCategoryDesignn()}
                            </div>
                        )}

                        {postData.category === "Engraving" && (
                            <div className='form-group'>
                                {ItemsSubCategoryGravuress()}
                            </div>
                        )}

                        {postData.category === "Digital_art" && (
                            <div className='form-group'>
                                {ItemsSubCategoryArtsNumeriquess()}
                            </div>
                        )}
                        {postData.category === "Collage" && (
                            <div className="form-group">
                                {ItemsSubCategoryCollagess()}
                            </div>
                        )}
                        {postData.category === "Textile_art" && (
                            <div className="Textile_art">
                                {ItemsSubCategoryArtTextilee()}
                            </div>
                        )}
                    </Form.Group>




                    <Form.Group>
                        <h3 className="m-0" style={{ color: '#3a86ff', marginBottom: '0.5rem', fontWeight: '500' }}> {t('sectionTitles.basicInfo')}</h3>
                        <div >{TitleInputt()}</div>
                        <div >{Descriptionnn()}</div>
                        <div >{ItemsCategoryy()}</div>
                    </Form.Group>



                    <Form.Group>
                        <h3 className="m-0" style={{ color: '#3a86ff', marginBottom: '0.5rem', fontWeight: '500' }}> {t('sectionTitles.artisticDetails')}</h3>

                        <div >
                            {ItemsSubCategoryStylee()}
                        </div>
                        <div >
                            {ItemsThemee()}
                        </div>
                        <div >
                            {Derechosdelautorr()}
                        </div>
                    </Form.Group>


                    <Form.Group>
                        <h3 className="m-0" style={{ color: '#3a86ff', marginBottom: '0.5rem', fontWeight: '500' }}> {t('sectionTitles.dimensions')}</h3>
                        <div >
                            {TalleSelectt()}
                        </div>
                        <div >
                            {MesureInputt()}
                        </div>
                        <div >
                            {UniteMesuree()}
                        </div>
                        <div >
                            {SuporteDeLaObraa()}
                        </div> </Form.Group>



                    <Form.Group>
                        <h3 className="m-0" style={{ color: '#3a86ff', marginBottom: '0.5rem', fontWeight: '500' }}> {t('sectionTitles.availabilityPrice')}</h3>


                        <div >
                            {PriceInputt()}
                        </div>

                        <div >
                            {DeviseVentee()}
                        </div>
                        <div >
                            {Negociarprecioo()}
                        </div>
                    </Form.Group>





                    <Form.Group>
                        <h3 className="m-0" style={{ color: '#3a86ff', marginBottom: '0.5rem', fontWeight: '500' }}> {t('sectionTitles.saleLogistics')}</h3>

                        <div >
                            {VenteOptionsSelectt()}
                        </div>
                        <div >
                            {Envolverlaobraa()}
                        </div>
                    </Form.Group>









                    <Form.Group>
                        <h3 className="m-0" style={{ color: '#3a86ff', marginBottom: '0.5rem', fontWeight: '500' }}> {t('sectionTitles.artistInfo')}</h3>

                        <div >
                            {wilayascommunes()}
                        </div>
                        {/*  <div >
                        {paisess()}
                    </div>
                    <div >
                        {ciudadInput()}
                    </div>*/}
                    </Form.Group>




                    <Form.Group>
                        <div className="status_body">

                            <div className="show_images">
                                {
                                    images.map((img, index) => (
                                        <div key={index} id="file_img">
                                            {
                                                img.camera ? imageShow(img.camera, theme)
                                                    : img.url
                                                        ? <>
                                                            {
                                                                img.url.match(/video/i)
                                                                    ? videoShow(img.url, theme)
                                                                    : imageShow(img.url, theme)
                                                            }
                                                        </>
                                                        : <>
                                                            {
                                                                img.type.match(/video/i)
                                                                    ? videoShow(URL.createObjectURL(img), theme)
                                                                    : imageShow(URL.createObjectURL(img), theme)
                                                            }
                                                        </>
                                            }
                                            <span onClick={() => deleteImage(index)}>&times;</span>
                                        </div>
                                    ))
                                }
                            </div>

                            {
                                stream &&
                                <div className="stream position-relative">
                                    <video autoPlay muted ref={videoRef} width="100%" height="100%"
                                        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

                                    <span onClick={handleStopStream}>&times;</span>
                                    <canvas ref={refCanvas} style={{ display: 'none' }} />
                                </div>
                            }

                            <div className="input_images">
                                {
                                    stream
                                        ? <i className="fas fa-camera" onClick={handleCapture} />
                                        : <>

                                            <div className="file_upload">
                                                <i className="fas fa-image" />
                                                <input type="file" name="file" id="file"
                                                    multiple accept="image/*,video/*" onChange={handleChangeImages} />
                                            </div>
                                        </>
                                }



                            </div>

                            <div className="status_footer">
                                <button className="btn btn-secondary w-100" type="submit">
                                    {t('button.post')}
                                </button>
                            </div>

                        </div> </Form.Group>

                </Form>

            </Container>
        </div>
    )
}

export default StatusModal

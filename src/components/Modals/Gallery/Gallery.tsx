import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
import type { galleryImages } from "../../../types";
import { Button } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface SingleGalleryProps {
    patientId: number
    study: string
    index: number
}

const SingleGallery: React.FC<SingleGalleryProps> = ({ study, patientId, index }) => {

    const [fetching, setFetching] = useState<boolean>(false)
    const [images, setImages] = useState<galleryImages[]>([])
    const galleryRef = useRef<ImageGallery>(null);
    const getGallery = async () => {
        setFetching(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/gallery/singleGallery?patientId=${patientId}&study=${study}`)
            if (res.data) {
                setImages(res.data.HD.map((HD: string, index: number) => ({
                    HD,
                    thumbnail: res.data.thumbnail[index],
                    original: res.data.original[index]
                })))
            }
        } catch (error) {
            handleError(error)
        } finally {
            setFetching(false)
        }
    }

    const handleDownload = async () => {
        if (galleryRef.current) {
            const currentIndex = galleryRef.current.getCurrentIndex();
            const currentImage = images[currentIndex];
            if (currentImage) {
                try {
                    const response = await fetch(currentImage.HD, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/octet-stream'
                        }
                    });
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `image-${currentIndex + 1}.jpg`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    handleError(error)
                }
            }
        }
    }

    useEffect(() => {
        getGallery()
    }, [])

    return (
        <div>
            <button type="button" aria-label="Descargar" onClick={handleDownload} className="position-absolute top-0 z-1 image-gallery-icon">
            <svg width="50" height="50" viewBox="0 0 512 512"  xmlns="http://www.w3.org/2000/svg" className="h-full w-full image-gallery-svg"><rect width="512" height="512" x="0" y="0" rx="30" fill="none" stroke="currentColor" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#ffffff" x="0" y="0" role="img" style={{display:"inline-block;vertical-align:middle"}} xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff"><path fill="currentColor" d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></g></svg></svg>
            </button>
            <ImageGallery
                items={images}
                startIndex={index}
                ref={galleryRef}
            >
            </ImageGallery>
        </div>
    )
}

export default SingleGallery
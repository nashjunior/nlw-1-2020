import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css'
import { FiUpload} from 'react-icons/fi'

interface Props {
  onFileUploaded: (file: File) => void;
}
const Dropzone: React.FC<Props>= ({onFileUploaded})=> {
  const [selectedFileURL, setSelectedFileURL] = useState('')
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const file = acceptedFiles[0]
    const fileURl = URL.createObjectURL(file)
    setSelectedFileURL(fileURl)
    onFileUploaded(file)
  }, [onFileUploaded])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: 'image/*'})

  return (
    <div {...getRootProps()}>
      <input className="dropzone" {...getInputProps()} accept="image/*"/>
      {
        selectedFileURL ? <img src={selectedFileURL} alt="Point Thumbnail"/>:<p><FiUpload/>Image do estabelecimento</p>
      }
      
      
    </div>
  )
}

export default Dropzone;